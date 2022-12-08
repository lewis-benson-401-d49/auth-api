'use strict';
const { server } = require('../src/server');
const supertest = require('supertest');
const request = supertest(server);
const { db } = require('../src/auth/models');
const { users } = require('../src/auth/models');


beforeAll(async () => {
  await db.sync();
  await users.create({
    username: 'tester1',
    password: 'password',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});


describe('AUTH Routes', () => {

  test('Finds a user', async () => {
    let users = await request.get('/api/v1/users');
    expect(users.text).toEqual('[\"tester1\"]');
    expect(users.status).toBe(200);
  });


  test('Creates a user to /signup', async () => {
    let user = await request.post('/api/v1/signup').send({
      username: 'tester',
      password: 'password',
      role: 'user',
    });
    expect(user.status).toBe(201);

  });

  test('Allows a user to /signin', async () => {
    let user = await request.post('/api/v1/signin').auth('tester', 'password');
    console.log(user.body.user.username, 'Lovely');
    expect(user.body.user.username).toEqual('tester');
  });

});



//

// POST /api/v1/:model 
// GET /api/v1/:model returns a list of :model items
// GET /api/v1/:model/ID returns a single item by ID
// PUT /api/v1/:model/ID returns a single, updated item by ID
// DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found

// V2 (Authenticated API Routes)

// POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item
// GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items
// GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID
// PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID
// DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found
