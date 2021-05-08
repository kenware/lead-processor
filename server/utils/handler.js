import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config';

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
  static generateToken(user) {
    const token = jwt.sign({ email: user.email }, config.secrete);
    return token;
  }

  /**
   * @response {key} account accessKey
   */
  static generateAccessKey() {
    return crypto.randomBytes(20).toString('hex');
  }

  /**
   * @param {object} ctx
   * @param {data} ctx.data
   * @response Boolean
   */
  static isObject(data) {
    return data instanceof Object && data.constructor === Object;
  }

  /**
   * @param {url} http endpoint
   * @response Boolean
   */
  static isUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))|' // OR ip (v4) address
    + 'localhost' // OR localhost
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(url);
  }

  /**
   * @param {url} http endpoint
   * @response new url
   */
  static getUrl(url) {
    if (config.env && config.env === 'local') {
      let newUrl = url.replace('localhost:5000', 'subscriber2:5000');
      newUrl = newUrl.replace('localhost:9000', 'subscriber1:9000');
      newUrl = newUrl.replace('127.0.0.1:5000', 'subscriber2:5000');
      newUrl = newUrl.replace('127.0.0.1:9000', 'subscriber1:9000');
      return newUrl;
    }
    return url;
  }
}
