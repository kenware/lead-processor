import serverless from "serverless-http";
import app from './server/server';
import RealeaseInProgressLeadCrone from './server/utils/crone';

export const server = serverless(app);
export const RealeaseInProgressLead =  RealeaseInProgressLeadCrone;
