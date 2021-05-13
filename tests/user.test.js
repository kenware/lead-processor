/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as AWS from "aws-sdk"; 
import app from '../server/server';
import { testUser } from './mock';
import * as sinon from 'sinon';
import bcrypt from 'bcryptjs';


// Configure chai
chai.use(chaiHttp);
chai.should();
let sinonSandbox;

describe('Test account', () => {

    afterEach((done) => {
        sinonSandbox.restore()
        done();
    })
  describe('POST /', () => {

    it('should create user account', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
        promise: function () {
            return Promise.resolve({});
        }
    });
    
        sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'put').returns({
            promise: function () {
                return Promise.resolve({});
            }
        });
      chai.request(app)
        .post('/v1/users')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('email').eql(testUser.email);
          res.body.should.have.property('name').eql(testUser.name);
          done();
        });
    });
  });

  it('should login account', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
        promise: function () {
            return Promise.resolve({ Item: {...testUser, password: bcrypt.hashSync(testUser.password, 8)}});
        }
    });
    chai.request(app)
      .post('/v1/users/login')
      .send(testUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('email').eql(testUser.email);
        done();
      });
  });
});
