const Transaction = require('../models/transactionModel');

exports.createTransaction = async (amount, description, fromAccountId, toAccountId) => {
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
};
