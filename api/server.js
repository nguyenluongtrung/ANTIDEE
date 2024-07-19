const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/dbConnect');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const Account = require('./models/accountModel'); // Import the Account model
const Transaction = require('./models/transaction');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

connectDB();
const __dir = path.resolve();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

async function createTransaction(amount, description, fromAccountId, toAccountId) {
    const transaction = new Transaction({
        amount,
        description,
        fromAccountId,
        toAccountId,
        status: 'PENDING'
    });

    try {
        await transaction.save();
        console.log('Transaction saved successfully');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

app.post('/payment', async (req, res) => {
    console.log("Payment endpoint hit");
    const { amount, userId } = req.body;
    console.log("Request body:", req.body);
    const embed_data = {
        redirecturl: 'http://127.0.0.1:5173/',
    };

    const items = [];
    const transID = new mongoose.Types.ObjectId();  // Tạo ObjectId mới

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: userId,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount,
        callback_url: 'https://6e8c-42-113-173-96.ngrok-free.app/callback',
        description: `Antidee - Payment for the order #${transID}`,
        bank_code: '',
    };

    const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        console.log("Sending request to ZaloPay...");
        const result = await axios.post(config.endpoint, null, {
            params: order
        });

        console.log("ZaloPay response:", result.data);

        if (result.data.return_code === 1) {
            console.log("Payment successful, updating user balance...");
            // Update the user's account balance in the database
            await updateUserBalance(userId, amount, transID.toString());  // Pass transID here
        }

        return res.status(200).json(result.data);
    } catch (error) {
        console.log("Error during payment processing:", error);
        return res.status(500).json({ error: 'Payment processing failed' });
    }
});

async function updateUserBalance(userId, amount, transId) {
    console.log("Updating user balance for user:", userId);
    // Find the user and update their account balance
    const user = await Account.findOne({ _id: userId });
    if (user) {
        // Check if the transaction has already been processed
        if (user.transactions && user.transactions.includes(transId)) {
            console.log("Transaction already processed");
            return;
        }

        // Update the user balance
        user.accountBalance += amount;

        // Add the transaction ID to the list of processed transactions
        user.transactions = user.transactions || [];
        user.transactions.push(transId);

        // Assuming 'toAccountId' is some account identifier you have
        const toAccountId = new mongoose.Types.ObjectId();  // Create a valid ObjectId

        await createTransaction(amount, `Payment for order #${transId}`, userId, toAccountId);
        await user.save();
        console.log("User balance updated successfully");
    } else {
        console.log("User not found");
    }
}

// Callback Endpoint
app.post('/callback', async (req, res) => {
    let result = {};
    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            let dataJson = JSON.parse(dataStr);
            const userId = dataJson['app_user'];
            const transId = dataJson['app_trans_id'];
            const amount = dataJson.amount;  // assuming 'amount' is in dataJson

            const existingTransaction = await Transaction.findOne({ _id: transId });

            if (existingTransaction && existingTransaction.status === 'COMPLETED') {
                console.log('Transaction already completed');
                result.return_code = 1;
                result.return_message = 'success';
            } else {
                // Update user balance and create a new transaction history
                await updateUserBalance(userId, amount, transId);
                await Transaction.findByIdAndUpdate(transId, { status: 'COMPLETED' });

                // Save transaction history
                const transactionHistory = new Transaction({
                    _id: transId,
                    amount: amount,
                    description: `Payment for order #${transId}`,
                    fromAccountId: userId,
                    toAccountId: new mongoose.Types.ObjectId(), // Replace this with actual toAccountId
                    status: 'COMPLETED'
                });

                await transactionHistory.save();
                console.log('Transaction history saved successfully');

                result.return_code = 1;
                result.return_message = 'success';
            }
        }
    } catch (ex) {
        console.log('Error:', ex.message);
        result.return_code = 0;
        result.return_message = ex.message;
    }

    res.json(result);
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
app.use('/antidee/api/transactions', require('./routes/transactionRoutes'));
app.use(express.static(path.join(__dir, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dir, 'client', 'dist', 'index.html'));
});

app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));

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

module.exports = { app, server, io };
