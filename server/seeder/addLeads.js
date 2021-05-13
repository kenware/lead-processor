const emailLeads = require('./initial');
const AWS = require("aws-sdk");

(async ()=> {
    const dynamoDbClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
    for(const email of emailLeads) {
        const item = {
           TableName: 'emailLeads',
           Item: email,
       };
       try{
       await dynamoDbClient.put(item).promise();
       }catch(err) {
           console.log(err)
       }
    }
  })();
