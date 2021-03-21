import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime";

const stack = pulumi.getStack();
const config = new pulumi.Config();
const reactBuildDir = "../frontend/build";
const accountId = config.require("aws-account");

//------------------------------------------------------------------------------- 
// FRONTEND SETUP
//------------------------------------------------------------------------------- 

const feBucket = new aws.s3.Bucket(`portfolio-bucket-${stack}`, {
  acl: "public-read",
  website: {
    indexDocument: "index.html",
    errorDocument: "index.html"
  },
  tags: {
    project: `portfolio-${stack}`
  }
});

const syncDirObjs = (dir: string, bucket: aws.s3.Bucket, folder: string | undefined = undefined) => {
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
        cacheControl: f === 'index.html' ? 'no-store' : 'public', // never cache index.html
        tags: {
          project: `portfolio-${stack}`
        }
      });
    }
  }
};

// sync built react app with s3 bucket
syncDirObjs(reactBuildDir, feBucket);

// create bucket policy to allow all objs to be readable
const feBucketPolicy = new aws.s3.BucketPolicy(`portfolio-bucket-policy-${stack}`, {
  bucket: feBucket.id,
  policy: pulumi.all([feBucket.bucket]).apply(([bucketName]) => JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Principal: "*",
      Action: [
        "s3:GetObject"
      ],
      Resource: [
        `arn:aws:s3:::${bucketName}/*`
      ]
    }]
  }))
});

//------------------------------------------------------------------------------- 
// DYNAMODB SETUP
//------------------------------------------------------------------------------- 
const tablePrefix = `portfolio-${stack}`;
const AboutTable = new aws.dynamodb.Table("portfolio-about-table", {
  name: `${tablePrefix}-about`,
  attributes: [
    { name: "id", type: "S" },
  ],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`
  }
});
const AdminTable = new aws.dynamodb.Table("portfolio-admin-table", {
  name: `${tablePrefix}-admin`,
  attributes: [
    { name: "id", type: "S" },
  ],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`
  }
});
const ProjectTable = new aws.dynamodb.Table("portfolio-project-table", {
  name: `${tablePrefix}-projects`,
  attributes: [
    { name: "id", type: "S" },
  ],
  hashKey: "id",
  readCapacity: 5,
  writeCapacity: 5,
  tags: {
    project: `portfolio-${stack}`
  }
});

const dynamoPolicy = new aws.iam.Policy("portfolio-db-policy", {
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: [
        "dynamodb:Scan"
      ],
      Resource: `arn:aws:dynamodb:ap-southeast-2:${accountId}:table/${tablePrefix}*`
    }]
  })
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
          Service: "lambda.amazonaws.com"
        },
        Action: "sts:AssumeRole"
      }
    ]
  }),
  tags: {
    project: `portfolio-${stack}`
  }
});
const dbAttachment = new aws.iam.RolePolicyAttachment("lambda-db-role-attachment", {
  role: lambdaRole.name,
  policyArn: dynamoPolicy.arn
});
const basicExcAttachment = new aws.iam.RolePolicyAttachment("lambda-basic-exc-attachment", {
  role: lambdaRole.name,
  policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
});

const getBlobFunc = new aws.lambda.Function(`portfolio-f-get-blob-${stack}`, {
  role: lambdaRole.arn,
  name: "getBlob",
  memorySize: 128,
  runtime: "nodejs14.x",
  handler: "index.getBlob",
  code: new pulumi.asset.FileArchive("../functions/getBlob"),
  tags: {
    project: `portfolio-${stack}`
  }
});

export const frontendBucketName = feBucket.id;
export const websiteUrl = feBucket.websiteEndpoint;
export const getBlobArn = getBlobFunc.name;