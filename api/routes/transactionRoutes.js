const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const { protect } = require('../middleware/accountMiddleware');

// Lấy lịch sử giao dịch của tài khoản đăng nhập
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ fromAccountId: req.account._id })
            .populate('fromAccountId', 'name accountBalance')
            .populate('toAccountId', 'name accountBalance');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

module.exports = router;
