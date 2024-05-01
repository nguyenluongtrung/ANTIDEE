const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createExam,
	getAllExams,
	getExam,
	deleteExam,
	updateExam,
} = require('../controllers/examController');
const router = express.Router();

router
	.route('/')
	.post(protect, restrict('Admin'), createExam)
	.get(protect, restrict('Admin'), getAllExams);
router
	.route('/:examId')
	.get(protect, restrict('Admin'), getExam)
	.delete(protect, restrict('Admin'), deleteExam)
	.patch(protect, restrict('Admin'), updateExam);

module.exports = router;
