const httpRequest = require('supertest');
const expect = require('expect.js');
const app = require('../index.js');
const User = require('../models/user');


describe('Stats Endpoint', async () => {
  let httpClient;
  let clientToken;
  before(async () => {

    httpClient = httpRequest(app);

    clientToken = (await httpClient.post('/api/users/register').send({
      name: 'John Doe',
      phone: '1234567890',
      role: 'CLIENT',
      password: '1234'
    })).body.token;

    adminToken = (await httpClient.post('/api/users/register').send({
      name: 'ADMIN Doe',
      phone: '1234567891',
      role: 'ADMIN',
      password: '1234'
    })).body.token;
  });

  after(async () => {
    await User.deleteMany();
  })

  it('should fail if user is not authorized', async () => {
    const response = await httpClient.get('/api/stats?page=1&limit=10');
    expect(response.body.message).to.equal('Unauthorized');
    expect(response.status).to.equal(401);
  });

  it('should fail if user is not an admin', async () => {
    // console.log(clientToken);
    const response = await httpClient.get('/api/stats?page=1&limit=10').set('Authorization', `Bearer ${clientToken}`);
    expect(response.body.message).to.equal('Unauthorized: Only admin can access stats');
    expect(response.status).to.equal(401);
  });

  it('should successfully retrieve stats for an admin user', async () => {
    const response = await httpClient.get('/api/stats?page=1&limit=2').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).to.equal(200);
  });
});