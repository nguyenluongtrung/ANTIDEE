const express = require('express');
const router = express.Router();
const { createPayment, paymentCallback, updateUserBalance } = require('../controllers/paymentController');
 
router.post('/payment', createPayment);
 
router.post('/callback', paymentCallback);
 
router.post('/updateBalance', async (req, res) => {
    const { userId, amount } = req.body;
    const transId = req.query.transId;  
    try {
        await updateUserBalance(userId, amount, transId);
        res.json({ message: "Số dư đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 

module.exports = router;
