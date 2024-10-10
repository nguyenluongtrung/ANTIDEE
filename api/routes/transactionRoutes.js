const express = require('express');
const router = express.Router(); 
const { protect } = require('../middleware/accountMiddleware');
const { getTransactions } = require('../controllers/transactionController');
router.get('/', protect, getTransactions);

module.exports = router;
