/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as AWS from "aws-sdk"; 
import app from '../server/server';
import { token, sampleLead, testUser, adminToken } from './mock';
import * as sinon from 'sinon';


// Configure chai
chai.use(chaiHttp);
chai.should();
let sinonSandbox;

describe('Test Leads', () => {

    afterEach((done) => {
        sinonSandbox.restore()
        done();
    })
  describe('Test lead /', () => {

    it('It should not assign a lead to inactive users', (done) => {
        sinonSandbox = sinon.createSandbox();
        sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
            promise: function () {
                return Promise.resolve({});
            }
        });
        sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'query').returns({
            promise: function () {
                return Promise.resolve({Items: []});
            }
        });
      chai.request(app)
        .get('/v1/emails/lead')
        .set('authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('message').eql('Users that are away are not assigned a lead');
          done();
        });
    });

  it('should get a lead', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'get').returns({
        promise: function () {
            return Promise.resolve({ Item: { ...testUser, isActive: true} });
        }
    });
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'query').returns({
        promise: function () {
            return Promise.resolve({ Items: [sampleLead]});
        }
    });
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
        promise: function () {
            return Promise.resolve({});
        }
    });
    chai.request(app)
      .get('/v1/emails/lead')
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('email').eql(sampleLead.email);
        done();
      });
  });

  it('It should process a lead by making a decision', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
        promise: function () {
            return Promise.resolve({});
        }
    });
  chai.request(app)
    .post('/v1/emails/leads/decision')
    .set('authorization', `Bearer ${token}`)
    .send({ decision: 'Positive reply', emailLeadId: sampleLead.emailLeadId})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      done();
    });
});

it('Normal users should not be able to change lead decision to pending', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
        promise: function () {
            return Promise.resolve({});
        }
    });
  chai.request(app)
    .post('/v1/emails/leads/status')
    .set('authorization', `Bearer ${token}`)
    .send({ status: 'Pending', emailLeadId: sampleLead.emailLeadId})
    .end((err, res) => {
      console.log(err)
      console.log(res.body)
      res.should.have.status(401);
      res.body.should.be.an('object');
      res.body.should.have.property('message').eql('Insufficient privilege');
      done();
    });
});

it('Admin should be able to change lead decision to pending', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(AWS.DynamoDB.DocumentClient.prototype, 'update').returns({
        promise: function () {
            return Promise.resolve({});
        }
    });
  chai.request(app)
    .post('/v1/emails/leads/status')
    .set('authorization', `Bearer ${adminToken}`)
    .send({ status: 'Pending', emailLeadId: sampleLead.emailLeadId})
    .end((err, res) => {
      console.log(err)
      console.log(res.body)
      res.should.have.status(200);
      res.body.should.be.an('object');
      done();
    });
});

});
});
