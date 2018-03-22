const Sequelize = require('sequelize');
const db_config = require('./db');

const { database, username, password, host, dialect } = db_config;

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect, //Dialect needs to be explicitly given
    timezone: '+07:00' //Set the timezone
});

module.exports = sequelize;
  