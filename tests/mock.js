import Handler from '../server/utils/handler';
const uuid = require('uuid');

export const testUser = {
  name: 'Test user',
  email: 'test@test.com',
  password: 'testuseraccount',
};

export const token =  Handler.generateToken(testUser.email, testUser.name, false);

export const adminToken =  Handler.generateToken(testUser.email, testUser.name, true);

export const sampleLead = {
  email: 'lead@bant.io',
  subject: 'hello',
  body: 'This is a test lead',
  emailLeadId: uuid.v4(),
}
