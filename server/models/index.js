import AWS from "aws-sdk";

AWS.config.update({region: "us-west-2"});
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

export default dynamoDbClient;
