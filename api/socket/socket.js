
const { Server } = require('socket.io');

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('sendMessage', (messageData) => {
      io.to(messageData.chatId).emit('receiveMessage', messageData);
      io.emit('notification', messageData);
    });

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
    });
  });

  return io;
}

module.exports = setupSocketIO;
