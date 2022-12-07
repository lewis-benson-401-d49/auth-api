'use strict';
const { app } = require('../src/server');
const supertest = require('supertest');
const request = supertest(app);
const { sequelize } = require('../src/models');
const { userInterface } = require('../src/models');


beforeAll(async () => {
  await sequelize.sync();
  await userInterface.create({
    username: 'tester1',
    password: 'password',
  });
});

afterAll(async () => {
  await sequelize.drop();
});


describe('Rest API Server', () => {

  test('Finds a user', async () => {
    let users = await (request.get('/users'));
    console.log(users);

  });


  test('Creates a user', async () => {
    let user = await (request.post('/signup')).send({
      username: 'tester',
      password: 'password',
    });
    expect(user.body.username).toEqual('tester');
  });
});