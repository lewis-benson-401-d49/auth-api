'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes/model.js');
const foodModel = require('./food/model.js');
const Collection = require('../../../auth-server/src/auth/models/data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL);

module.exports = {
  db: sequelize,

};
