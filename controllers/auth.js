const User = require('../models/User');
const jwt = require('jsonwebtoken');
const regNewAccountRequest = async (payload, ws) => {
  const { login, email, pass, repass } = payload;

  if (pass !== repass) {
    ws.send(new Error(`Pass and repass does not match`).message);
  }
  const tempUser = { login, email, pass };
  await User.create({ ...tempUser });
  ws.send();
};

const authLoginRequest = async (payload, ws) => {
  const { login, pass } = payload;
  if (!login || !pass) {
    ws.send(new Error(`Pass and login are required`).message);
  }

  const user = await User.findOne({ where: { login } });

  if (!user) {
    ws.send(new Error('Invalid credentials').message);
  }

  const isPasswordCorrect = await user.comparePassword(pass);
  if (!isPasswordCorrect) {
    ws.send(new Error(`Invalid credentials`).message);
  }

  const token = user.createJWT();
  ws.send(JSON.stringify({ token, user }));
};

const authTokenRequest = async (payload, ws) => {
  const { authHeader } = payload;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ws.send(new Error(`Authentication invalid`).message);
  }

  const token = authHeader.split(' ')[1];

  try {
    const tempVerify = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { login: tempVerify.login } });
    ws.send(JSON.stringify({ auth: true, user }));
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  regNewAccountRequest,
  authLoginRequest,
  authTokenRequest,
};
