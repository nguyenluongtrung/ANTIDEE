const mongoose = require('mongoose');

const systemBalanceSchema = new mongoose.Schema({
	currentBalance: { type: Number, required: true, default: 0 },
	dailyTransactions: [
		{
			accountId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
				required: true,
			},
			message: {
				type: String,
			},
			date: { type: Date, required: true, unique: true },
			totalIncome: { type: Number, required: true, default: 0 },
			totalExpenses: { type: Number, required: true, default: 0 },
		},
	],
	lastUpdated: { type: Date, default: Date.now },
});

const SystemBalance = mongoose.model('SystemBalance', systemBalanceSchema);

module.exports = SystemBalance;
