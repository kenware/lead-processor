# lead-processor

## Installation Guide
* Ensure you have a serverless installed on your machine
* create an aws profile called bant
```
aws configure --profile bant
```
* Follow the rest of the process of configuring aws secrete key.
* install packages
```
npm i
```
* deploy to aws lambda with
```
serverless deploy
```
* You can also start local server with `serverless offline start`

## Run test on your local
* Run test with `npm test`

## Documentation