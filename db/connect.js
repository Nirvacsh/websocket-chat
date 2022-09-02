require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  `${process.env.DIALECt}://${process.env.UNAME}:${process.env.PASSWORD}@${process.env.HOST}:5432/${process.env.DATABASE}`
);

module.exports = sequelize;
