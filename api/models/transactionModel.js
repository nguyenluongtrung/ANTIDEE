const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
	accountId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
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
		enum: ['income', 'expense', 'other'],
	},
});

transactionSchema.pre('save', function (next) {
	this.updatedDate = Date.now();
	next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
