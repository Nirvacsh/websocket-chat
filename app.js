const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const sequelize = require('./db/connect');
const authRoutes = require('./controllers/auth');
const chatRoutes = require('./controllers/chat');
const User = require('./models/User');
const Message = require('./models/Message');
const Room = require('./models/Room');
const app = express();

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

Message.belongsTo(User, {
  foreignKey: 'userId',
});
Message.belongsTo(Room, {
  foreignKey: 'roomId',
});
User.hasMany(Message, {
  foreignKey: 'userId',
});
User.belongsToMany(Room, { through: 'UserRooms', foreignKey: 'userId', timestamps: false });
Room.belongsToMany(User, { through: 'UserRooms', foreignKey: 'roomId', timestamps: false });
Room.hasMany(Message, {
  foreignKey: 'roomId',
});

const dispatchEvent = (message, ws) => {
  const json = JSON.parse(message);
  switch (json.event) {
    case 'reg-new-account-request':
      authRoutes.regNewAccountRequest(json.payload, ws);
    case 'auth-login-request':
      authRoutes.authLoginRequest(json.payload, ws);
    case 'auth-token-request':
      authRoutes.authTokenRequest(json.payload, ws);
    case 'room-create-request':
      chatRoutes.roomCreateRequest(json.payload, ws);
    case 'room-join-request':
      chatRoutes.roomJoinRequest(json.payload, ws);
    case 'send-message-request':
      chatRoutes.sendMessageRequest(json.payload, ws);
    case 'get-chat-users-request':
      chatRoutes.getChatUsersRequest(json.payload, ws);
    case 'get-chat-messages-request':
      chatRoutes.getChatMessagesRequest(json.payload, ws);
    default:
      ws.send(new Error('Wrong query').message);
  }
};

webSocketServer.on('connection', (ws) => {
  ws.on('message', (m) => dispatchEvent(m, ws));
  ws.on('error', (e) => ws.send(e));

  ws.send('Hi there, I am a WebSocket server');
});

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server is up on port ${port}`);
    });
    await sequelize.sync();
  } catch (error) {
    console.error(error);
  }
};

start();
