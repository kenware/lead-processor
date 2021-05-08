import serverless from "serverless-http";
import app from './server/server';


export const server = serverless(app);
