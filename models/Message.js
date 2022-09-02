require('dotenv').config();
const sequelize = require('../db/connect');
const Sequelize = require('sequelize');

const Message = sequelize.define(
  'message',
  {
    messageId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    timestamp: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = Message;
