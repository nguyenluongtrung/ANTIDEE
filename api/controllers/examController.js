const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');

const createExam = asyncHandler(async (req, res) => {
	const exam = await Exam.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			exam,
		},
	});
});
const getAllExams = asyncHandler(async (req, res) => {
	const exams = await Exam.find({});

	res.status(200).json({
		status: 'success',
		data: {
			exams,
		},
	});
});
const getExam = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId);

	if (!exam) {
		res.status(404);
		throw new Error('Không tìm thấy đề thi');
	}

	res.status(200).json({
		status: 'success',
		data: {
			exam,
		},
	});
});
const deleteExam = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId);

	if (!exam) {
		res.status(404);
		throw new Error('Không tìm thấy đề thi');
	}

	await Exam.findByIdAndDelete(req.params.examId);

	res.status(200).json({
		status: 'success',
	});
});
const updateExam = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId);

	if (!exam) {
		res.status(404);
		throw new Error('Không tìm thấy đề thi');
	}

	const updatedExam = await Exam.findByIdAndUpdate(
		req.params.examId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedExam,
		},
	});
});

module.exports = {
	createExam,
	getAllExams,
	getExam,
	deleteExam,
	updateExam,
};
