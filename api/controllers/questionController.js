const asyncHandler = require('express-async-handler');
const Question = require('../models/questionModel');

const createQuestion = asyncHandler(async (req, res) => {
	const question = await Question.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			question,
		},
	});
});

const getAllQuestions = asyncHandler(async (req, res) => {
	const questions = await Question.find({}).populate('serviceId');

	res.status(200).json({
		status: 'success',
		data: {
			questions,
		},
	});
});

const getQuestion = asyncHandler(async (req, res) => {
	const question = await Question.findById(req.params.questionId).populate(
		'serviceId'
	);

	if (!question) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	res.status(200).json({
		status: 'success',
		data: {
			question,
		},
	});
});

const deleteQuestion = asyncHandler(async (req, res) => {
	const question = await Question.findById(req.params.questionId);

	if (!question) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	await Question.findByIdAndDelete(req.params.questionId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.questionId,
		},
	});
});

const updateQuestion = asyncHandler(async (req, res) => {
	const question = await Question.findById(req.params.questionId);

	if (!question) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	const updatedQuestion = await Question.findByIdAndUpdate(
		req.params.questionId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedQuestion,
		},
	});
});

module.exports = {
	createQuestion,
	getAllQuestions,
	getQuestion,
	deleteQuestion,
	updateQuestion,
};
