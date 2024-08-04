const Transaction = require('../models/transactionModel');

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ fromAccountId: req.account._id })
            .populate('fromAccountId', 'name accountBalance')
            .populate('toAccountId', 'name accountBalance');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};
