const express = require('express');
const router = express.Router();
const { getTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/accountMiddleware');

// Lấy danh sách giao dịch
router.get('/', protect, getTransactions);

module.exports = router;
