const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, {
    "logging": false,
    "host": config.host,
    "dialect": config.dialect,
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.UserInfo = require('./userInfo')(sequelize, Sequelize);
db.Log = require('./log')(sequelize, Sequelize);
module.exports = db;
