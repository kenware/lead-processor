import moment from 'moment';
import Validator, { register } from 'validatorjs';
import Handler from '../utils/handler';
import { getUserParams, getLeadWithStatus } from '../utils/params';
import dynamoDbClient from '../models';
import logger from '../utils/logger';

export default class EmailLead {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {Function} next
   */
  static async validateDecision(req, res, next) {
    const rules = {
      emailLeadId: 'required|string',
      decision: ['required', { 'in': ['Positive reply', 'Neutral reply', 'Not a lead'] }],
    };
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
      return Handler.errorHandler(req, res, validation.errors.errors, 400);
    }
    req.decision = true;
    return next();
  }

    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {Function} next
   */
     static async validateStatus(req, res, next) {
        const rules = {
          emailLeadId: 'required|string',
          status: ['required', { 'in': ['Pending', 'InProgress', 'Done'] }],
        };
        const validation = new Validator(req.body, rules);
        if (validation.fails()) {
          return Handler.errorHandler(req, res, validation.errors.errors, 400);
        }
        register.status = true;
        return next();
    }

    /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {Function} next
   */
    static async validateQueryStatus(req, res, next) {
        const rules = {
            status: ['required', { 'in': ['Pending', 'InProgress', 'Done'] }],
        };
        const validation = new Validator(req.query, rules);
        if (validation.fails()) {
            return Handler.errorHandler(req, res, validation.errors.errors, 400);
        }
        return next();
   }

    /**
     * @param {object} ctx
     * @param {req} ctx.request
     * @param {res} ctx.response
     * @param {Function} next
     */
    static async checkEmailAssignee(req, res, next) {
        const { email } = req.decoded;

        try {
            const user = await dynamoDbClient.get(getUserParams(email)).promise();
            const params = getLeadWithStatus('InProgress', null, [{ field: 'resolvingBy', value: email}]);
            const { Items } = await dynamoDbClient.query(params).promise();
            if (user.Item && user.Item.isActive) {
                if (Items.length && Items[0].timestamp) {
                    const start = moment(Items[0].timestamp, 'YYYY.MM.DD HH:mm:ss');
                    if (moment().diff(start, 'seconds') >= 120) {
                        logger.info('Release lead with Inprogress status from the user');
                        await Handler.releaseInprogressLead(Items[0].emailLeadId);
                        return next();
                    }
                    return Handler.successHandler(req, res, Items[0], 200);
                }
                return next();
            }else {
                if (Items.length) {
                    logger.info('Release lead with Inprogress status from the user');
                    await Handler.releaseInprogressLead(Items[0].emailLeadId);
                }
                const message = 'Users that are away are not assigned a lead';
                return Handler.errorHandler(req, res, message, 400);
            }
        } catch (err) {
            logger.info(err.message);
            return Handler.errorHandler(req, res, err.message || 'Error occured', 400);
        }
  }
};
