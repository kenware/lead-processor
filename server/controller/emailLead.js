import moment from 'moment';
import Handler from '../utils/handler';
import { updateItem, getLeadWithStatus } from '../utils/params';
import dynamoDbClient from '../models';
import logger from '../utils/logger';

export default class EmailLead {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async getLead(req, res) {
    const { email } = req.decoded;
    let message;
    try {
        // Get the oldest pending email to process
        const params = getLeadWithStatus('Pending', 10);
        const { Items } = await dynamoDbClient.query(params).promise();
        let data = Items.find(item => item.resolvingBy != email);
        if (Items.length) {
            if (!data) data = Items[0];
            data.status = 'InProgress';
            data.timestamp = `${moment().format('YYYY.MM.DD HH:mm:ss')}`;
            data.resolvingBy = email;
            const attributes = [
                { field: 'status', value: data.status},
                { field: 'timestamp', value: data.timestamp},
                { field: 'resolvingBy', value: email},
            ];
            const updateParams = updateItem(data.emailLeadId, attributes);
            await dynamoDbClient.update(updateParams).promise();
            return Handler.successHandler(req, res, data, 200);
        }
        message = 'OOPS, It looks like there is no email to process at this time';
        return Handler.errorHandler(req, res, message, 400);

    } catch (err) {
      logger.info(err.message);
      return Handler.errorHandler(req, res, err.message, 400);
    }
  }

    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
     static async decisionOrStatus(req, res) {
        const { emailLeadId, decision, status } = req.body;
        const { email, name } = req.decoded;
        let data = {
            status,
            timestamp: `${moment().format('YYYY.MM.DD HH:mm:ss')}`,
            decision,
            emailLeadId
        };

        if (req.decision) {
            data.resolvedBy = { name, email };
            data.status = 'Done';
            data.decision = decision;
        }

        try {
            const attributes = [
                { field: 'status', value: data.status},
                { field: 'timestamp', value: data.timestamp},
            ];
            if (req.decision) {
                attributes.push(
                   { field: 'resolvedBy', value: { name, email } }
                );
                attributes.push(
                    { field: 'decision', value: decision},
                 );

            };
            const updateParams = updateItem(emailLeadId, attributes);
            await dynamoDbClient.update(updateParams).promise();
            return Handler.successHandler(req, res, data, 200);
        } catch (err) {
          return Handler.errorHandler(req, res, err.message, 400);
        }
      }

    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
    static async fetchLeads(req, res) {
        const { status } = req.query;
        try {
            const params = getLeadWithStatus(status);
            const data = await dynamoDbClient.query(params).promise();
            return Handler.successHandler(req, res, data, 200);

        } catch (err) {
          logger.info(err.message);
          return Handler.errorHandler(req, res, err.message, 400);
        }
    }
}
