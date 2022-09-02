require('dotenv').config();
const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = sequelize.define(
  'user',
  {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    pass: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

User.beforeCreate(async (user, options) => {
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(user.pass, salt);
  user.pass = hashedPassword;
});

User.prototype.createJWT = function () {
  return jwt.sign({ userLogin: this.login }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

User.prototype.comparePass = async function (candidatePass) {
  const isMatch = await bcryptjs.compare(candidatePass, this.pass);
  return isMatch;
};
module.exports = User;
