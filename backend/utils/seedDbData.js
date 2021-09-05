const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

const ENV = "prod";
const dataPath = path.join(__dirname, "..", "seed");
console.log(dataPath);

AWS.config.update({ region: "ap-southeast-2" });
var docClient = new AWS.DynamoDB.DocumentClient();

const projects = JSON.parse(
  fs.readFileSync(path.join(dataPath, "projects.json"))
);
projects.forEach((project) => {
  docClient.put(
    {
      TableName: `portfolio-${ENV}-projects`,
      Item: {
        id: project.id,
        tech: project.tech,
        name: project.name,
        githubUrl: project.githubUrl,
        body: project.body,
      },
    },
    (err) => console.error(JSON.stringify(err))
  );
});

const about = JSON.parse(fs.readFileSync(path.join(dataPath, "about.json")));
about.forEach((about) => {
  docClient.put(
    {
      TableName: `portfolio-${ENV}-about`,
      Item: {
        id: about.id,
        heading: about.heading,
        body: about.body,
        subHeading: about.subHeading,
      },
    },
    (err) => console.error(JSON.stringify(err))
  );
});
