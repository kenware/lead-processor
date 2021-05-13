# lead-processor

## Installation Guide
* Ensure you have a serverless installed on your machine
* create an aws profile called bant
```
 aws configure --profile bant
```
* Follow the rest of the process of configuring aws secrete access key [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
* install packages
```
 yarn install
```
* deploy to aws lambda with
```
 serverless deploy
```
* You can also start local server with `serverless offline start`

* To Load initial data to dynamo db after deploy run this command in the project root folder
```
 node server/seeder/addLeads.js
```

## Run test on your local
* Run test with `npm test`

## Some API Documentation
```
 Base url: https://1deqyn3uk5.execute-api.us-west-2.amazonaws.com/dev/v1
```
* Create a User

Request 
```
/POST /users

{
"email": "test1@user.com",
"password": "12345678",
"name": "test"
}
```

Response

```
{
    "name": "test",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHVzZXIuY29tIiwibmFtZSI6InRlc3QiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjIwODk4MzU2fQ.iCgzqXmkZYqD40-zBRpylBGgVu3bzgUcULzQbQthn2M",
    "email": "test1@user.com",
    "isAdmin": false
}
```

* Login

Request

```
/POST /users/login

{
"email": "test1@user.com",
"password": "12345678"
}
```

Response

```
{
    "name": "test",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHVzZXIuY29tIiwibmFtZSI6InRlc3QiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjIwODk4MzU2fQ.iCgzqXmkZYqD40-zBRpylBGgVu3bzgUcULzQbQthn2M",
    "email": "test1@user.com",
    "isAdmin": false
}
```

* Get A lead to process

Request

```
GET /emails/lead

Headers = { authorization: 'Bearer <token>'}
```

Response

```
{
    "subject": "schedule a call, Steve",
    "date": "2020.02.03",
    "resolvingBy": "test1@user.com",
    "status": "InProgress",
    "timestamp": "2021.05.13 09:38:06",
    "emailLeadId": "5ce16ca6-8688-4cf0-937d-d1ad45367d30",
    "email": "steve.cannon@agenor.co.uk",
    "body": "Hi Brian, this isn’t part of my domain but in any event, \n        we are comfortable with regard to our use of LinkedIn at the moment.\n        Thanks,\n        \n        Steve.\n        Stephen Cannon\n        Head of Digital Services \n        T: +44(0) 131 297 2270  M: +44(0) 7879 407544\n        www.agenor.co.uk\n        "
}
```

* Make A decision on a lead

Request

```
POST /emails/decision

{
    "emailLeadId": "5ce16ca6-8688-4cf0-937d-d1ad45367d30",
    "decision" "Not A Lead"

}
```
Response

```
{
decision: "Positive reply"
emailLeadId: "a355e1ee-a195-413d-9624-3ef27793bbe2"
resolvedBy: {name: "bantadmin", email: "bantadmin@bant.io"}
status: "Done"
timestamp: "2021.05.13 09:43:29"
}
```
