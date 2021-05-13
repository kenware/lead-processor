import bcrypt from 'bcryptjs';
import Handler from '../utils/handler';
import { getUserItems, getUserParams, updateItem } from '../utils/params';
import dynamoDbClient from '../models';

export default class User {
  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async create(req, res) {
    const { email, name } = req.body;
    const items = getUserItems(email, {name, password: req.hash, isAdmin: false, isActive: true });
    try {
      await dynamoDbClient.put(items).promise();
      const token = Handler.generateToken(email, name, false);

      return Handler.successHandler(req, res, { name, token, email, isAdmin: false }, 201);
    } catch (err) {
      return Handler.errorHandler(req, res, err.message, 400);
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const message = 'Wrong username or password';
    try {
      const { Item } = await dynamoDbClient.get(getUserParams(email)).promise();
      if (Item  && bcrypt.compareSync(password, Item.password)) {
        const { name, email, isAdmin, isActive } = Item;
        const token = Handler.generateToken(email, name, isAdmin);
        return Handler.successHandler(req, res, { name, token, email, isAdmin, isActive }, 201);
      }
      return Handler.errorHandler(req, res, message, 400);
    } catch (err) {
      return Handler.errorHandler(req, res, err.message || message, 400);
    }
  }

  /**
   * @param {object} ctx
   * @param {req} ctx.request
   * @param {res} ctx.response
   */
  static async changeStatus(req, res) {
    const { email } = req.decoded;
    const { isActive } = req.body;
    try {
      const attributes = [
        { field: 'isActive', value: isActive },
      ];
      const updateParams = updateItem(email, attributes, 'users');
      delete updateParams.Key.emailLeadId;
      updateParams.Key.email = email;
      await dynamoDbClient.update(updateParams).promise();
      return Handler.successHandler(req, res,{ email, isActive }, 200);
    } catch (err) {
      return Handler.errorHandler(req, res, err.message, 400);
    }
  }
}
