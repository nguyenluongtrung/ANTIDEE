const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createQuestion,
	getAllQuestions,
	getQuestion,
	deleteQuestion,
	updateQuestion,
} = require('../controllers/questionController');
const router = express.Router();

router
	.route('/')
	.post(protect, restrict('admin'), createQuestion)
	.get(protect, restrict('admin'), getAllQuestions);
router
	.route('/:questionId')
	.get(protect, restrict('admin'), getQuestion)
	.delete(protect, restrict('admin'), deleteQuestion)
	.patch(protect, restrict('admin'), updateQuestion);

module.exports = router;
