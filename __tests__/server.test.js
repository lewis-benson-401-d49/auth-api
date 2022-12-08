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

const getToken = async () => {
  return await request.post('/api/v1/signin').auth('tester1', 'password');
};

const addOneFood = async (foodItem) => {
  const admin = await getToken();
  let auth = admin.body.user.token;
  let food = await request.post('/api/v1/food').send({
    name: foodItem,
    calories: 100,
    type: 'fruit',
  }).set('Authorization', 'bearer ' + auth);
  return food;
};


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
    expect(user.body.user.username).toEqual('tester');
  });

});

describe('V1 (Unauthenticated API) routes', () => {


  test('adds an item to the DB and returns an object with the added item', async () => {
    const food = await addOneFood('apple');
    expect(food.status).toBe(201);
    expect(food.body.name).toEqual('apple');
  });

  test('model returns a list of :model items', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    await addOneFood('banana');
    await addOneFood('pickle');
    let foods = await request.get('/api/v1/food').send().set('Authorization', 'bearer ' + auth);
    expect(foods.body).toHaveLength(3);
    expect(foods.status).toBe(200);
  });

  test('returns a single item by ID', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let foods = await request.get('/api/v1/food/2').send().set('Authorization', 'bearer ' + auth);
    expect(foods.body.name).toEqual('banana');
    expect(foods.status).toBe(200);
  });

  test('returns a single, updated item by ID', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let food = await request.put('/api/v1/food/2').send({
      name: 'notBanana',
      calories: 100,
      type: 'fruit',
    }).set('Authorization', 'bearer ' + auth);
    expect(food.body.name).toEqual('notBanana');
    expect(food.status).toBe(200);
  });

  test('returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let food = await request.delete('/api/v1/food/2').set('Authorization', 'bearer ' + auth);
    expect(food.body).toEqual(1);
    expect(food.status).toBe(200);

    let sameFood = await request.get('/api/v1/food/2').set('Authorization', 'bearer ' + auth);
    expect(sameFood.body).toBeNull;
    expect(sameFood.status).toBe(200);
  });

});

describe('V2 (Authenticated API Routes)', () => {


  test('adds an item to the DB and returns an object with the added item', async () => {
    const food = await addOneFood('apple');
    expect(food.status).toBe(201);
    expect(food.body.name).toEqual('apple');
  });

  test('model returns a list of :model items', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    await addOneFood('banana');
    await addOneFood('pickle');
    let foods = await request.get('/api/v2/food').send().set('Authorization', 'bearer ' + auth);
    expect(foods.body).toHaveLength(5);
    expect(foods.status).toBe(200);
  });

  test('returns a single item by ID', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let foods = await request.get('/api/v2/food/3').send().set('Authorization', 'bearer ' + auth);
    expect(foods.body.name).toEqual('pickle');
    expect(foods.status).toBe(200);
  });

  test('returns a single, updated item by ID', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let food = await request.put('/api/v2/food/3').send({
      name: 'notBanana',
      calories: 100,
      type: 'fruit',
    }).set('Authorization', 'bearer ' + auth);
    expect(food.body.name).toEqual('notBanana');
    expect(food.status).toBe(200);
  });

  test('returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const admin = await getToken();
    let auth = admin.body.user.token;
    let food = await request.delete('/api/v2/food/3').set('Authorization', 'bearer ' + auth);
    expect(food.body).toEqual(1);
    expect(food.status).toBe(200);

    let sameFood = await request.get('/api/v2/food/3').set('Authorization', 'bearer ' + auth);
    expect(sameFood.body).toBeNull;
    expect(sameFood.status).toBe(200);
  });

});
