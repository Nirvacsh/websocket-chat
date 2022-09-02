require('dotenv').config();
const sequelize = require('../db/connect');
const Sequelize = require('sequelize');

const Room = sequelize.define(
  'room',
  {
    roomId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
  },
  { timestamps: false }
);

module.exports = Room;
