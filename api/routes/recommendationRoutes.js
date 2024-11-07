const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const { recommend } = require('../controllers/recommendationController');

const router = express.Router();

router
	.route('/')
	.get(protect, recommend);

module.exports = router;
