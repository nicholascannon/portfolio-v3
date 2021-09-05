import {
  APIGatewayProxyEvent,
  Handler,
  APIGatewayProxyResult,
} from "aws-lambda";
import DynamoDB from "aws-sdk/clients/dynamodb";

const db = process.env.IS_OFFLINE
  ? new DynamoDB({ region: "localhost", endpoint: "http://localhost:8001" })
  : new DynamoDB({ region: "ap-southeast-2" });
const unmarshall = DynamoDB.Converter.unmarshall;

const Response = (status: number, body: any, headers?: any) => ({
  statusCode: status,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...headers,
  },
});

export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> =
  async (event, context) => {
    try {
      const projects = await db
        .scan({
          TableName: `${process.env.TABLE_PREFIX}-projects`,
        })
        .promise();
      const about = await db
        .scan({
          TableName: `${process.env.TABLE_PREFIX}-about`,
        })
        .promise();

      const projectsStatus = projects.$response.httpResponse.statusCode;
      const aboutStatus = about.$response.httpResponse.statusCode;
      if (projectsStatus !== 200) {
        console.error(
          `Error fetching projects: status=${projectsStatus}, error=${projects.$response.error}`
        );
        return Response(500, { message: "Could not fetch list of projects" });
      }
      if (aboutStatus !== 200) {
        console.error(
          `Error fetching about: status=${aboutStatus}, error=${about.$response.error}`
        );
        return Response(500, { message: "Could not fetch about information" });
      }

      return Response(200, {
        about: about.Items?.length ? unmarshall(about.Items[0]) : undefined,
        projects: projects.Items?.map((project) => unmarshall(project)),
      });
    } catch (e) {
      console.error(e.message);
      return Response(500, { message: "Oops, an error has occurred!" });
    }
  };
