const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require('../config/paymentConfig');
const Transaction = require('../models/transactionModel');
const Account = require('../models/accountModel');
const transactionController = require('./transactionController');

exports.createPayment = async (req, res) => {
	const { amount, userId } = req.body;
	const embed_data = {
		redirecturl: 'http://127.0.0.1:5173/',
	};

	const items = [];
	const transID = new mongoose.Types.ObjectId();

	const order = {
		app_id: config.app_id,
		app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
		app_user: userId,
		app_time: Date.now(),
		item: JSON.stringify(items),
		embed_data: JSON.stringify(embed_data),
		amount: amount,
		callback_url:
			'https://c316-42-115-113-153.ngrok-free.app/callback',
		description: `Nạp tiền vào ví người dùng`,
		bank_code: '',
	};

	const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
	order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

	try {
		console.log('Sending request to ZaloPay...');
		const result = await axios.post(config.endpoint, null, { params: order });

		console.log('ZaloPay response:', result.data);

		if (result.data.return_code === 1) {
			console.log('Payment successful, updating user balance...');
			await updateUserBalance(userId, amount, transID.toString());
		}

		return res.status(200).json(result.data);
	} catch (error) {
		console.log('Error during payment processing:', error);
		return res.status(500).json({ error: 'Payment processing failed' });
	}
};

exports.paymentCallback = async (req, res) => {
	const dataStr = req.body.data;
	const reqMac = req.body.mac;

	const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

	if (reqMac !== mac) {
		return res
			.status(401)
			.json({ return_code: -1, return_message: 'MAC validation failed' });
	}

	try {
		const dataJson = JSON.parse(dataStr);
		const userId = dataJson['app_user'];
		const transId = dataJson['app_trans_id'];
		const amount = dataJson['amount'];

		const existingTransaction = await Transaction.findOne({ _id: transId });

		if (existingTransaction && existingTransaction.status === 'COMPLETED') {
			console.log('Transaction already completed');
			return res.json({
				return_code: 1,
				return_message: 'Transaction already completed',
			});
		}

		await updateUserBalance(userId, amount, transId);
		await Transaction.findByIdAndUpdate(transId, { status: 'COMPLETED' });
 
		return res.json({
			return_code: 1,
			return_message: 'Transaction completed successfully',
		});
	} catch (error) {
		console.log('Callback handling error:', error);
		return res
			.status(500)
			.json({ return_code: 0, return_message: error.message });
	}
};

async function updateUserBalance(userId, amount, transId) {
	console.log('Updating user balance for user:', userId);
	const user = await Account.findOne({ _id: userId });
	if (user) { 
		if (user.transactions && user.transactions.includes(transId)) {
			console.log('Transaction already processed');
			return;
		}
 
		user.accountBalance += amount;
		user.transactions = user.transactions || [];
		user.transactions.push(transId);
 
		await transactionController.addNewTransaction(
			amount,
			userId,
			`Nạp tiền vào ví người dùng`,
			`balance_income`,  
			null, 
			`${transId}`,  
			`ZaloPay` 
		);
		 
		await user.save(); 
	}  
}

