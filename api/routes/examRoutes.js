const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createExam,
	getAllExams,
	getExam,
	deleteExam,
	updateExam,
	saveExamResult,
} = require('../controllers/examController');
const router = express.Router();

router
	.route('/')
	.post(protect, restrict('Admin'), createExam)
	.get(protect, getAllExams);
router.route('/save-exam-result/:examId').patch(protect, saveExamResult);
router
	.route('/:examId')
	.get(protect, getExam)
	.delete(protect, restrict('Admin'), deleteExam)
	.patch(protect, restrict('Admin'), updateExam);

module.exports = router;
