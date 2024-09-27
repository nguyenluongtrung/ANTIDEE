const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
	accountId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	jobId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'JobPost',
	},
	externalId: {
		type: String,
	},
	paymentMethod: {
		type: String,
		enum: ['ZaloPay', 'Ví người dùng', 'Tiền mặt'],
	},
	message: {
		type: String,
	},
	date: { type: Date, required: true },
	amount: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		enum: [
			'salary',
			'commission_fee',
			'job_income',
			'refund',
			'balance_income',
		],
	},
});

transactionSchema.pre('save', function (next) {
	this.updatedDate = Date.now();
	next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
