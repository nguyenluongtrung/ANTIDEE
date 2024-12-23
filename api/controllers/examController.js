const asyncHandler = require('express-async-handler');
const Exam = require('../models/examModel');
const AccountExam = require('../models/accountExamModel');
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
		qualificationId,
		name,
	} = req.body;

	if (
		!category ||
		!numOfEasyQuestion ||
		!numOfMediumQuestion ||
		!duration ||
		!passGrade ||
		!name
	) {
		res.status(400);
		throw new Error('Vui lòng điền đủ thông tin');
	}
	const existedEntryExam = await Exam.find({
		qualificationId: qualificationId,
		category: 'Kiểm tra đầu vào',
	});
	if (category == 'Kiểm tra đầu vào' && existedEntryExam.length > 0) {
		res.status(400);
		throw new Error('Đã tồn tại bài kiểm tra đầu vào của chứng chỉ này');
	}
	if (
		Number(passGrade) >
		Number(numOfEasyQuestion) +
			Number(numOfMediumQuestion) +
			Number(numOfHardQuestion)
	) {
		res.status(400);
		throw new Error('Điểm cần đạt không hợp lệ');
	}

	const allEasyQuestionList = (
		await Question.find({ difficultyLevel: 'Dễ' }).populate('serviceId')
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	const allMediumQuestionList = (
		await Question.find({ difficultyLevel: 'Bình thường' }).populate(
			'serviceId'
		)
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	const allHardQuestionList = (
		await Question.find({ difficultyLevel: 'Khó' }).populate('serviceId')
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	if (Number(numOfEasyQuestion) > allEasyQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi dễ cần tạo');
	} else if (Number(numOfMediumQuestion) > allMediumQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi bình thường cần tạo');
	} else if (Number(numOfHardQuestion) > allHardQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi khó cần tạo');
	}

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
		qualificationId,
		duration,
		description,
		category,
		passGrade,
		name,
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
	const exams = await Exam.find({})
		.populate('qualificationId')
		.populate('questions.easyQuestion.easyQuestionList')
		.populate('questions.mediumQuestion.mediumQuestionList')
		.populate('questions.hardQuestion.hardQuestionList');

	res.status(200).json({
		status: 'success',
		data: {
			exams,
		},
	});
});
const getExam = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId).populate(
		'qualificationId'
	);

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
		data: {
			id: req.params.examId,
		},
	});
});
const updateExam = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId);

	if (!exam) {
		res.status(404);
		throw new Error('Không tìm thấy đề thi');
	}

	const {
		numOfEasyQuestion,
		numOfMediumQuestion,
		numOfHardQuestion,
		numOfQuestions,
		duration,
		category,
		passGrade,
		qualificationId,
		name,
	} = req.body;

	if (
		!category ||
		!numOfEasyQuestion ||
		!numOfMediumQuestion ||
		!duration ||
		!passGrade ||
		!name
	) {
		res.status(400);
		throw new Error('Vui lòng điền đủ thông tin');
	}
	if (
		Number(passGrade) >
		Number(numOfEasyQuestion) +
			Number(numOfMediumQuestion) +
			Number(numOfHardQuestion)
	) {
		res.status(400);
		throw new Error('Điểm cần đạt không hợp lệ');
	}

	const allEasyQuestionList = (
		await Question.find({ difficultyLevel: 'Dễ' }).populate('serviceId')
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	const allMediumQuestionList = (
		await Question.find({ difficultyLevel: 'Bình thường' }).populate(
			'serviceId'
		)
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	const allHardQuestionList = (
		await Question.find({ difficultyLevel: 'Khó' }).populate('serviceId')
	).filter(
		(question) =>
			question.serviceId &&
			String(question.serviceId.requiredQualification) ===
				String(qualificationId)
	);

	if (Number(numOfEasyQuestion) > allEasyQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi dễ cần tạo');
	} else if (Number(numOfMediumQuestion) > allMediumQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi bình thường cần tạo');
	} else if (Number(numOfHardQuestion) > allHardQuestionList.length) {
		res.status(400);
		throw new Error('Không đủ số lượng câu hỏi khó cần tạo');
	}

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
		qualificationId,
		duration,
		category,
		passGrade,
		name,
	};

	const updatedExam = await Exam.findByIdAndUpdate(
		req.params.examId,
		examInfo,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedExam,
		},
	});
});
const saveExamResult = asyncHandler(async (req, res) => {
	const exam = await Exam.findById(req.params.examId);

	if (!exam) {
		res.status(404);
		throw new Error('Không tìm thấy đề thi');
	}

	const { accountId, totalScore, duration, isPassed } = req.body;

	try {
		await AccountExam.create({
			accountId,
			examId: req.params.examId,
			totalScore,
			duration,
			isPassed,
		});
		res.status(200).json({
			status: 'success',
		});
	} catch (err) {
		res.status(500);
		throw new Error('Error saving exam result');
	}
});

const getMyExamResults = asyncHandler(async (req, res) => {
	const results = await AccountExam.find({
		accountId: req.account._id,
	}).populate('examId');

	res.status(200).json({
		status: 'success',
		data: {
			results,
		},
	});
});

module.exports = {
	createExam,
	getAllExams,
	getExam,
	deleteExam,
	updateExam,
	saveExamResult,
	getMyExamResults,
};
