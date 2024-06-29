const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
require('./utils/scheduledTasks/jobCancellation');

const http = require('http');
const { Server } = require('socket.io');


const connectDB = require('./config/dbConnect');
const port = process.env.PORT || 5000;


connectDB();
const __dir = path.resolve();
const app = express();


app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});



app.use('/antidee/api/accounts', require('./routes/accountRoutes'));
app.use('/antidee/api/questions', require('./routes/questionRoutes'));
app.use('/antidee/api/exams', require('./routes/examRoutes'));
app.use('/antidee/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/antidee/api/videos', require('./routes/videoRoutes'));
app.use('/antidee/api/services', require('./routes/serviceRoutes'));
app.use('/antidee/api/jobPosts', require('./routes/jobPostRoutes'));
app.use('/antidee/api/vouchers', require('./routes/voucherRoutes'));
app.use(
	'/antidee/api/domesticHelperFeedbacks',
	require('./routes/domesticHelper_FeedbackRoutes')
);
app.use('/antidee/api/promotions', require('./routes/promotionRoutes'));
app.use('/antidee/api/appFeedback', require('./routes/appFeedbackRouters'));
app.use('/antidee/api/chat', require('./routes/chatRoutes'));
app.use('/antidee/api/message', require('./routes/messageRoutes'));


app.use(express.static(path.join(__dir, '/client/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dir, 'client', 'dist', 'index.html'));
});

app.use(errorHandler);


module.exports = { app, server, io };

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('sendMessage', (messageData) => {
        io.to(messageData.chatId).emit('receiveMessage', messageData);
    
         // Notify all connected clients about the new message
         io.emit('notification', messageData);
    });

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });
});

//app.listen(port, () => console.log(`Server started on port ${port}`));

server.listen(port, () => console.log(`Server started on port ${port}`));
