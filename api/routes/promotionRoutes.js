const express = require('express');
const {
	getAllPromotions,
	createPromotion,
	updatePromotion,
	deletePromotion,
	getPromotion,
} = require('../controllers/promotionController');
const { protect, restrict } = require('../middleware/accountMiddleware');
const router = express.Router();

router
	.route('/')
	.get(getAllPromotions)
	.post(protect, restrict('Admin'), createPromotion);
router
	.route('/:promotionId')
	.get(protect, restrict('Admin'), getPromotion)
	.patch(protect, restrict('Admin'), updatePromotion)
	.delete(protect, restrict('Admin'), deletePromotion);

module.exports = router;