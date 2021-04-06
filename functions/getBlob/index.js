const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const db = new DynamoDB({ region: "ap-southeast-2" });

const Response = (status, body, headers) => ({
  statusCode: status,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...headers,
  },
});

const getBlob = async (event, context) => {
  try {
    const projects = await db.scan({
      TableName: `${process.env.TABLE_PREFIX}-projects`,
    });
    const about = await db.scan({
      TableName: `${process.env.TABLE_PREFIX}-about`,
    });

    const projectsStatus = projects.$metadata.httpStatusCode;
    const aboutStatus = about.$metadata.httpStatusCode;
    if (projectsStatus !== 200)
      throw new Error(
        `Error fetching projects, status code = ${projectsStatus}`
      );
    if (projectsStatus !== 200)
      throw new Error(`Error fetching about, status code = ${aboutStatus}`);

    return Response(200, {
      about: about.Items.length ? unmarshall(about.Items[0]) : null,
      projects: projects.Items.map((project) => unmarshall(project)),
    });
  } catch (e) {
    console.error(e.message);
    return Response(400, { message: e.message });
  }
};

module.exports.getBlob = getBlob;
