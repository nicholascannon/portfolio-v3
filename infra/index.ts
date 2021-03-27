import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const reactBuildDir = "../frontend/build";
const accountId = config.require("aws-account");
const zoneId = config.require("hostedZoneId");

//-------------------------------------------------------------------------------
// FRONTEND SETUP
//-------------------------------------------------------------------------------

const feBucket = new aws.s3.Bucket(`portfolio-bucket-${stack}`, {
  acl: "public-read",
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

// create bucket policy to allow all objs to be readable
const feBucketPolicy = new aws.s3.BucketPolicy(
  `portfolio-bucket-policy-${stack}`,
  {
    bucket: feBucket.id,
    policy: pulumi.all([feBucket.bucket]).apply(([bucketName]) =>
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      })
    ),
  }
);

//-------------------------------------------------------------------------------
// DYNAMODB SETUP
//-------------------------------------------------------------------------------
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

//-------------------------------------------------------------------------------
// LAMBDA SETUP
//-------------------------------------------------------------------------------
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
    policyArn:
      "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
  }
);

const getBlobFunc = new aws.lambda.Function(`portfolio-f-get-blob-${stack}`, {
  role: lambdaRole.arn,
  name: "getBlob",
  memorySize: 128,
  runtime: "nodejs14.x",
  handler: "index.getBlob",
  code: new pulumi.asset.FileArchive("../functions/getBlob"),
  environment: {
    variables: {
      TABLE_PREFIX: tablePrefix,
    },
  },
  tags: {
    project: `portfolio-${stack}`,
  },
});

//-------------------------------------------------------------------------------
// API SETUP
//-------------------------------------------------------------------------------
const api = new awsx.apigateway.API(`portfolio-api-${stack}`, {
  routes: [
    {
      path: "/",
      method: "GET",
      eventHandler: getBlobFunc,
    },
  ],
  stageName: stack,
});

//-------------------------------------------------------------------------------
// RECORDS SETUP
//-------------------------------------------------------------------------------
const homeRec = new aws.route53.Record(`portfolio-record-home-a-${stack}`, {
  zoneId,
  name: "niccannon.com",
  type: "A",
  ttl: 3600,
  records: ["165.22.50.81"],
});

const homeRecCNAME = new aws.route53.Record(
  `portfolio-record-home-cname-${stack}`,
  {
    zoneId,
    name: "www.niccannon.com",
    type: "CNAME",
    ttl: 3600,
    records: ["niccannon.com"],
  }
);

const apiRec = new aws.route53.Record(`portfolio-record-api-a-${stack}`, {
  zoneId,
  name: "api.niccannon.com",
  type: "A",
  ttl: 3600,
  records: ["165.22.50.81"],
});

//-------------------------------------------------------------------------------
// CERT SETUP
//-------------------------------------------------------------------------------
const cert = new aws.acm.Certificate(`portfolio-cert-${stack}`, {
  domainName: "niccannon.com",
  subjectAlternativeNames: ["www.niccannon.com"],
  validationMethod: "DNS",
  tags: {
    project: `portfolio-${stack}`,
  },
});

const validationOpts = cert.domainValidationOptions.apply((dvo) =>
  dvo.map((rec) => ({
    name: rec.resourceRecordName,
    value: rec.resourceRecordValue,
    type: rec.resourceRecordType,
    domainName: rec.domainName
  }))
);

const valRecords = validationOpts.apply((opts) =>
  opts.map(
    (opt) =>
      new aws.route53.Record(`portfolio-val-rec-${opt.domainName}-${stack}`, {
        allowOverwrite: true,
        name: opt.name,
        records: [opt.value],
        ttl: 60,
        type: opt.type,
        zoneId,
      })
  )
);

const certValidation = new aws.acm.CertificateValidation(
  `portfolio-cert-val-${stack}`,
  {
    certificateArn: cert.arn,
    validationRecordFqdns: valRecords.apply((recs) =>
      recs.map((record) => record.fqdn)
    ),
  }
);

export const bucketUrl = feBucket.websiteEndpoint;
export const apiUrl = api.url;
export const certArn = certValidation.certificateArn;
