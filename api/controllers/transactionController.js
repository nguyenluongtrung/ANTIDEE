const Transaction = require('../models/transactionModel');

const createTransaction = async (
	amount,
	description,
	fromAccountId,
	toAccountId
) => {
	const transaction = new Transaction({
		amount,
		description,
		fromAccountId,
		toAccountId,
		status: 'PENDING',
	});

	try {
		await transaction.save();
		console.log('Transaction saved successfully');
	} catch (error) {
		console.error('Error saving transaction:', error);
	}
};

const addNewTransaction = async (amount, accountId, message, category) => {
	try {
		const newTransaction = await Transaction.create({
			accountId,
			message,
			date: new Date(),
			amount,
			category,
		});
		return newTransaction;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	addNewTransaction,
	createTransaction,
};
