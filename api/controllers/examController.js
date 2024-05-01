const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');
const Question = require('../models/questionModel');

const createExam = asyncHandler(async (req, res) => {
	const {
		numOfEasyQuestion,
		numOfMediumQuestion,
		numOfHardQuestion,
		numOfQuestions,
		duration,
		description,
		category,
		passGrade,
	} = req.body;

	const allEasyQuestionList = await Question.find({ difficultyLevel: 'Dễ' });
	const allMediumQuestionList = await Question.find({
		difficultyLevel: 'Bình thường',
	});
	const allHardQuestionList = await Question.find({ difficultyLevel: 'Khó' });

	const randomEasyQuestionList = [];
	const randomMediumQuestionList = [];
	const randomHardQuestionList = [];

	for (let i = 0; i < Number(numOfEasyQuestion); i++) {
		const randomIndex = Math.floor(Math.random() * allEasyQuestionList.length);
		const randomQuestion = allEasyQuestionList.splice(randomIndex, 1)[0];
		randomEasyQuestionList.push(randomQuestion);
	}

	for (let i = 0; i < Number(numOfMediumQuestion); i++) {
		const randomIndex = Math.floor(
			Math.random() * allMediumQuestionList.length
		);
		const randomQuestion = allMediumQuestionList.splice(randomIndex, 1)[0];
		randomMediumQuestionList.push(randomQuestion);
	}

	for (let i = 0; i < Number(numOfHardQuestion); i++) {
		const randomIndex = Math.floor(Math.random() * allHardQuestionList.length);
		const randomQuestion = allHardQuestionList.splice(randomIndex, 1)[0];
		randomHardQuestionList.push(randomQuestion);
	}

	const examInfo = {
		questions: {
			numOfQuestions,
			easyQuestion: {
				numOfEasyQuestion,
				easyQuestionList: randomEasyQuestionList,
			},
			mediumQuestion: {
				numOfMediumQuestion,
				mediumQuestionList: randomMediumQuestionList,
			},
			hardQuestion: {
				numOfHardQuestion,
				hardQuestionList: randomHardQuestionList,
			},
		},
		duration,
		description,
		category,
		passGrade,
	};

	const exam = await Exam.create(examInfo);
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
