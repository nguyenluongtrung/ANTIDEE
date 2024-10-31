// socket/socket.js
const { Server } = require('socket.io');

function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173/',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    // Xử lý khi người dùng ngắt kết nối
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    // Xử lý gửi tin nhắn
    socket.on('sendMessage', (messageData) => {
      // Phát tin nhắn tới những người dùng khác trong phòng
      io.to(messageData.chatId).emit('receiveMessage', messageData);
      
      // Phát thông báo tới toàn bộ hệ thống nếu cần
      io.emit('notification', messageData);
    });

    // Xử lý người dùng tham gia phòng chat
    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });
  });

  return io;
}

module.exports = setupSocketIO;
