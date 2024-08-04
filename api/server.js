const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/dbConnect');
const port = process.env.PORT || 5000;
const app = express();

// Connect to database
connectDB();

// Server configuration
const __dir = path.resolve();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create HTTP server
const server = http.createServer(app);
const setupSocketIO = require('./socket/socket');
const io = setupSocketIO(server);

// Routes setup
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
app.use('/antidee/api/transactions', require('./routes/transactionRoutes'));
app.use('/antidee/api/payment', require('./routes/paymentRoutes'));
app.use('/antidee/api/forumPosts', require('./routes/forumPostRoutes'));
// Serve static files
app.use(express.static(path.join(__dir, '/client/dist')));

// Handle SPA
app.get('*', (req, res) => {
	res.sendFile(path.join(__dir, 'client', 'dist', 'index.html'));
});

// Use error handler middleware
app.use(errorHandler);

// Start server
server.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app, server, io };
