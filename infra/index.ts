import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const certStack = new pulumi.StackReference(
  "nicholascannon1/portfolio-cert/prod"
);

const reactBuildDir = "../frontend/build";
const certArn = certStack.getOutput("certArn");
const accountId = config.require("aws-account");
const zoneId = config.require("hostedZoneId");

// Frontend
const feBucket = new aws.s3.Bucket(`portfolio-bucket-${stack}`, {
  acl: "private",
  website: {
    indexDocument: "index.html",
    errorDocument: "index.html",
  },
  tags: {
    project: `portfolio-${stack}`,
  },
});

const syncDirObjs = (
  dir: string,
  bucket: aws.s3.Bucket,
  folder: string | undefined = undefined
) => {
  for (let f of fs.readdirSync(dir)) {
    if (f === ".DS_Store") continue;

    const fPath = path.join(dir, f);
    if (fs.lstatSync(fPath).isDirectory()) {
      // recurse on the dir and sync files with prefix
      const folderPath = folder === undefined ? f : `${folder}/${f}`;
      syncDirObjs(fPath, bucket, folderPath);
    } else {
      let obj = new aws.s3.BucketObject(f, {
        bucket: bucket,
        key: folder === undefined ? f : `${folder}/${f}`,
        source: new pulumi.asset.FileAsset(fPath),
        contentType: mime.getType(fPath) || undefined,
        cacheControl: f === "index.html" ? "no-store" : "public", // never cache index.html
        tags: {
          project: `portfolio-${stack}`,
        },
      });
    }
  }
};

// sync built react app with s3 bucket
syncDirObjs(reactBuildDir, feBucket);

const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  `portfolio-frontend-oai-${stack}`,
  {
    comment: "OAI for accessing portfolio frontend bucket",
  }
);

const feBucketPolicy = new aws.s3.BucketPolicy(
  `portfolio-bucket-policy-${stack}`,
  {
    bucket: feBucket.id,
    policy: pulumi
      .all([feBucket.bucket, originAccessIdentity.iamArn])
      .apply(([bucketName, oiaArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                AWS: oiaArn,
              },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
          ],
        })
      ),
  }
);

// DB tables
const tablePrefix = `portfolio-${stack}`;
const AboutTable = new aws.dynamodb.Table("portfolio-about-table", {
  name: `${tablePrefix}-about`,
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`,
  },
});

const AdminTable = new aws.dynamodb.Table("portfolio-admin-table", {
  name: `${tablePrefix}-admin`,
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`,
  },
});

const ProjectTable = new aws.dynamodb.Table("portfolio-project-table", {
  name: `${tablePrefix}-projects`,
  attributes: [{ name: "id", type: "S" }],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`,
  },
});

const dynamoPolicy = new aws.iam.Policy("portfolio-db-policy", {
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: ["dynamodb:Scan"],
        Resource: `arn:aws:dynamodb:ap-southeast-2:${accountId}:table/${tablePrefix}*`,
      },
    ],
  }),
});

// Lambda
const lambdaRole = new aws.iam.Role(`lambda-execution-role-${stack}`, {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  }),
  tags: {
    project: `portfolio-${stack}`,
  },
});

const dbAttachment = new aws.iam.RolePolicyAttachment(
  "lambda-db-role-attachment",
  {
    role: lambdaRole.name,
    policyArn: dynamoPolicy.arn,
  }
);

const basicExcAttachment = new aws.iam.RolePolicyAttachment(
  "lambda-basic-exc-attachment",
  {
    role: lambdaRole.name,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
  }
);

const getBlobFunc = new aws.lambda.Function(`portfolio-f-get-blob-${stack}`, {
  role: lambdaRole.arn,
  name: "getBlob",
  memorySize: 128,
  runtime: "nodejs14.x",
  handler: "index.getBlob",
  code: new pulumi.asset.FileArchive("../functions/getBlob/dist"),
  environment: {
    variables: {
      TABLE_PREFIX: tablePrefix,
    },
  },
  tags: {
    project: `portfolio-${stack}`,
  },
});

// API
const api = new aws.apigateway.RestApi(`portfolio-api-${stack}`, {});

const getBlobResource = new aws.apigateway.Resource(
  `portfolio-get-blob-resource-${stack}`,
  {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "blob",
  }
);

const getBlobMethod = new aws.apigateway.Method(
  `portfolio-get-blob-method-${stack}`,
  {
    restApi: api.id,
    resourceId: getBlobResource.id,
    httpMethod: "GET",
    authorization: "NONE",
  }
);

const getBlobIntegration = new aws.apigateway.Integration(
  `portfolio-get-blob-integration-${stack}`,
  {
    restApi: api.id,
    resourceId: getBlobResource.id,
    httpMethod: getBlobMethod.httpMethod,
    type: "AWS_PROXY",
    integrationHttpMethod: "POST", // lambdas can only be invoked via POST
    uri: getBlobFunc.invokeArn,
  }
);

const getBlobPermission = new aws.lambda.Permission(
  `portfolio-get-blob-permission-${stack}`,
  {
    action: "lambda:InvokeFunction",
    function: getBlobFunc.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*/*`, // API_ARN/stage/METHOD_HTTP_VERB/Resource-path
  }
);

const apiDeployment = new aws.apigateway.Deployment(
  `portfolio-api-deployment-${stack}`,
  {
    restApi: api.id,
    stageName: stack,
  },
  {
    dependsOn: [getBlobIntegration],
  }
);

// CDN
const distribution = new aws.cloudfront.Distribution(
  `portolio-distribution-${stack}`,
  {
    origins: [
      {
        domainName: feBucket.bucketRegionalDomainName,
        s3OriginConfig: {
          originAccessIdentity:
            originAccessIdentity.cloudfrontAccessIdentityPath,
        },
        originId: "frontend",
      },
      {
        // the url contains the stage path (the stack)
        domainName: apiDeployment.invokeUrl.apply((url) =>
          url.replace("https://", "").replace(`/${stack}`, "")
        ),
        customOriginConfig: {
          httpPort: 80,
          httpsPort: 443,
          originSslProtocols: ["TLSv1.2"],
          originProtocolPolicy: "https-only",
        },
        originId: "api",
      },
    ],
    enabled: true,
    defaultRootObject: "index.html",
    aliases: ["niccannon.com", "www.niccannon.com"],
    defaultCacheBehavior: {
      allowedMethods: ["GET", "HEAD", "OPTIONS"],
      cachedMethods: ["GET", "HEAD"],
      targetOriginId: "frontend",
      forwardedValues: {
        queryString: false,
        cookies: {
          forward: "none",
        },
      },
      viewerProtocolPolicy: "redirect-to-https",
      minTtl: 0,
      defaultTtl: 3600,
      maxTtl: 3600,
    },
    orderedCacheBehaviors: [
      {
        pathPattern: `/${stack}/*`,
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD"],
        targetOriginId: "api",
        forwardedValues: {
          queryString: true,
          cookies: {
            forward: "none",
          },
        },
        // No cache
        minTtl: 0,
        maxTtl: 0,
        defaultTtl: 0,
        viewerProtocolPolicy: "redirect-to-https",
      },
    ],
    customErrorResponses: [
      {
        // required to send responses to react router
        errorCode: 404,
        responseCode: 404,
        responsePagePath: "/index.html",
      },
    ],
    restrictions: {
      geoRestriction: {
        restrictionType: "none",
      },
    },
    viewerCertificate: {
      acmCertificateArn: certArn,
      sslSupportMethod: "sni-only",
    },
    tags: {
      project: `portfolio-${stack}`,
    },
  }
);

// DNS records
const homeRec = new aws.route53.Record(`portfolio-record-home-a-${stack}`, {
  zoneId,
  name: "niccannon.com",
  type: "A",
  aliases: [
    {
      evaluateTargetHealth: false, // false for simple routing
      name: distribution.domainName,
      zoneId: distribution.hostedZoneId,
    },
  ],
});

const homeRecCNAME = new aws.route53.Record(
  `portfolio-record-home-cname-${stack}`,
  {
    zoneId,
    name: "www.niccannon.com",
    type: "CNAME",
    ttl: 300,
    records: ["niccannon.com"],
  }
);

export const bucketUrl = feBucket.websiteEndpoint;
export const apiUrl = apiDeployment.invokeUrl;
export const distributionDomain = distribution.domainName;
export const oai = originAccessIdentity.iamArn;
