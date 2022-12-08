'use strict';

const userModel = require('./users.js');
const { Sequelize, DataTypes } = require('sequelize');
const foodModel = require('../models/food/model');
const clothesModel = require('../models/clothes/model');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);

const food = foodModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  food: new Collection(food),
  clothes: new Collection(clothes),
};
