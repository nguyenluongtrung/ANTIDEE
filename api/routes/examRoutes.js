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
	.post(protect, restrict('admin'), createExam)
	.get(protect, restrict('admin'), getAllExams);
router
	.route('/:examId')
	.get(protect, restrict('admin'), getExam)
	.delete(protect, restrict('admin'), deleteExam)
	.patch(protect, restrict('admin'), updateExam);

module.exports = router;
