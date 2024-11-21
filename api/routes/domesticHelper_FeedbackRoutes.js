const express = require('express');
const { protect } = require('../middleware/accountMiddleware');
const {
	getAllFeedbacks,
	createFeedback,
	deleteFeedback,
	getFeedbackById,
	replyToFeedback,
	deleteReply,
	updateReply,
	getFeedbackDetail,
} = require('../controllers/domesticHelper_FeedbackController');

const router = express.Router();

router.route('/').get(getAllFeedbacks).post(protect, createFeedback);

router
	.route('/:feedbackId')
	.get(protect, getFeedbackById)
	.delete(protect, deleteFeedback);

router
	.route('/detail/:jobPostId/:feedbackFrom')
	.get(protect, getFeedbackDetail);

router.route('/reply/:feedbackId').post(protect, replyToFeedback);

router
	.route('/reply/:feedbackId/:replyId')
	.delete(protect, deleteReply)
	.patch(protect, updateReply);

module.exports = router;
