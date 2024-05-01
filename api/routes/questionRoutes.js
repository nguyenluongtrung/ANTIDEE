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
	.post(protect, restrict('Admin'), createQuestion)
	.get(protect, restrict('Admin'), getAllQuestions);
router
	.route('/:questionId')
	.get(protect, restrict('Admin'), getQuestion)
	.delete(protect, restrict('Admin'), deleteQuestion)
	.patch(protect, restrict('Admin'), updateQuestion);

module.exports = router;
