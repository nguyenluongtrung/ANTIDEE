const Transaction = require('../models/transactionModel');


const addNewTransaction = async (
	amount,
	accountId,
	message,
	category,
	jobId,
	externalId,
	paymentMethod
) => {
	try {
		const newTransaction = await Transaction.create({
			accountId,
			message,
			date: new Date(),
			amount,
			category,
			jobId,
			externalId,
			paymentMethod,
		});
		console.log('Creating new transaction with:', {
			amount,
			accountId,
			message,
			category,
			jobId,
			externalId,
			paymentMethod,
		  });
		return newTransaction;
		
	} catch (error) {
		throw error;
	}
};
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ accountId: req.account._id })
            .populate('accountId', 'name accountBalance');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};
module.exports = {
	addNewTransaction,
	getTransactions,
	 
};
