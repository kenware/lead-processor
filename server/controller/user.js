import bcrypt from 'bcryptjs';
import AWS from "aws-sdk";
import Handler from '../utils/handler';
import { getUserItems, getUserParams } from '../utils/params';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

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
      const token = Handler.generateToken(email, false);

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
        const { name, email, password, isAdmin } = Item;
        const token = Handler.generateToken(email, false);
        return Handler.successHandler(req, res, { name, token, email, isAdmin }, 201);
      }
      return Handler.errorHandler(req, res, message, 400);
    } catch (err) {
      return Handler.errorHandler(req, res, err.message || message, 400);
    }
  }

  // /**
  //  * @param {object} ctx
  //  * @param {req} ctx.request
  //  * @param {res} ctx.response
  //  */
  // static async accountDetails(req, res) {
  //   try {
  //     const data = {
  //       where: { id: req.decoded.id },
  //       include: {
  //         model: Models.Topic,
  //         as: 'topics',
  //         include: [
  //           { model: Models.Subscription, as: 'subscribers' },

  //         ],
  //       },
  //     };

  //     const account = await Models.Account.findOne(data);
  //     return Handler.successHandler(req, res, account, 200);
  //   } catch (err) {
  //     return Handler.errorHandler(req, res, err.message, 400);
  //   }
  // }
}
