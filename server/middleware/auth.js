import jwt from 'jsonwebtoken';
import config from '../config';
import Handler from '../utils/handler';

export default class Auth {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   * @param {Function} next
   */
  static async Authenticate(req, res, next) {
    try {
      if (req.headers.authorization) {
        const [bearer, token] = req.headers.authorization.split(' ');
        if (bearer === 'Bearer' && token) {
          const decoded = jwt.verify(token, config.secrete);
          req.decoded = decoded;
          return next();
        }
      }
      return Handler.errorHandler(req, res, 'Invalid token', 401);
    } catch (err) {
      return Handler.errorHandler(req, res, err.message || 'Invalid token', 401);
    }
  }
}
