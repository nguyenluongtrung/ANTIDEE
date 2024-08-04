// File: routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment, paymentCallback } = require('../controllers/paymentController');

router.post('/payment', createPayment);

router.post('/callback', paymentCallback);


module.exports = router;
