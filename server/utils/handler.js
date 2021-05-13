import jwt from 'jsonwebtoken';
import dynamoDbClient from '../models';
import config from '../config';
import { updateItem } from './params';

export default class Handler {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {mesage} string error
   * @param {status} HttpCode status
   */
  static errorHandler(req, res, message, status) {
    return res.status(status || 400).json({
      message,
      status,
    });
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {data} ctx.data response data
   * @param {status} HttpCode status
   */
  static successHandler(req, res, data, status) {
    return res.status(status || 200).json(data);
  }

  /**
   * @param {object} ctx
   * @param {user} ctx.user a user account
   * @response {token}
   */
  static generateToken(email, name, isAdmin) {
    const token = jwt.sign({ email, name, isAdmin }, config.secrete);
    return token;
  }

  /**
   * @response {key} releaseInprogressLead
   */
  static async releaseInprogressLead(emailLeadId) {
    try{
      const params = updateItem(emailLeadId, [{ field: 'status', value: 'Pending' }]);
      await dynamoDbClient.update(params).promise();
      return true;
    }catch(err) {
      throw err;
    }
  }
}

