'use strict';

const express = require('express');
const dataModules = require('../auth/models');
const bearerAuth = require('../auth/middleware/bearer');
const router = express.Router();
const { users } = require('../auth/models');
const basicAuth = require('../auth/middleware/basic');



router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});
router.get('/secret', bearerAuth, handleSecret);
router.post('/signup', handleSignup);
router.post('/signin', basicAuth, handleSignin);
router.get('/users', bearerAuth, handleUsers);
router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, handleCreate);
router.put('/:model/:id', bearerAuth, handleUpdate);
router.delete('/:model/:id', bearerAuth, handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let theRecord = await req.model.get(id);
  res.status(200).json(theRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deletedRecord = await req.model.delete(id);
  res.status(200).json(deletedRecord);
}

function handleSecret(req, res) {
  res.status(200).send('Welcome to the secret area');
}

async function handleSignup(req, res, next) {
  try {
    let userRecord = await users.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
}

async function handleSignin(req, res) {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
}


async function handleUsers(req, res, next) {
  const userRecords = await users.findAll({});
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
}

module.exports = router;
