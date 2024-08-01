// File: routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment, paymentCallback, updateUserBalance } = require('../controllers/paymentController');

// Tạo thanh toán
router.post('/payment', createPayment);

// Callback thanh toán
router.post('/callback', paymentCallback);

// Cập nhật số dư (Cần một trình xử lý trung gian)
router.post('/updateBalance', async (req, res) => {
    const { userId, amount } = req.body;
    const transId = req.query.transId; // hoặc một số cách khác để truyền transId phù hợp với logic của bạn
    try {
        await updateUserBalance(userId, amount, transId);
        res.json({ message: "Số dư đã được cập nhật" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Kiểm tra trạng thái thanh toán (Cần thêm controller) 

module.exports = router;
