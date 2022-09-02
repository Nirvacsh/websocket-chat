const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

const roomCreateRequest = async (payload, ws) => {
  const { roomId } = payload;
  if (!roomId) {
    ws.send(new Error('Wrong request').message);
  }
  await Room.create({ roomId });
  ws.send(JSON.stringify({ roomId }));
};

const getChatUsersRequest = async (payload, ws) => {
  const { roomId } = payload;
  if (!roomId) {
    ws.send(new Error('Wrong request').message);
  }

  try {
    const users = await User.findAll({ where: { roomId } });
    ws.send(JSON.stringify([...users]));
  } catch (error) {
    console.error(error);
  }
};

const getChatMessagesRequest = async (payload, ws) => {
  const { roomId } = payload;
  if (!roomId) {
    ws.send(new Error('Wrong request').message);
  }
  try {
    const messages = await Message.findAll({ where: { roomId } });
    ws.send(JSON.stringify([...messages]));
  } catch (error) {
    console.error(error);
  }
};

const roomJoinRequest = async (payload, ws) => {
  const { roomId } = payload;
  if (!roomId) {
    ws.send(new Error('Wrong request').message);
  }
};
const sendMessageRequest = async (payload, ws) => {
  const { roomId, message, userId } = payload;

  if (!roomId || !message || !userId) {
    ws.send(new Error(`Invalid request`).message);
  }

  try {
    const message = await Message.create({ message, timestamp: Date.now(), roomId, userId });
    ws.send({ message });
  } catch (error) {
    console.error(error);
  }
};
module.exports = {
  roomCreateRequest,
  getChatUsersRequest,
  getChatMessagesRequest,
  roomJoinRequest,
  sendMessageRequest,
};
