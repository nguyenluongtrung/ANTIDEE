const asyncHandler = require('express-async-handler');
const Qualification = require('../models/qualificationModel');
const AccountQualification = require('../models/accountQualificationModel');

const createQualification = asyncHandler(async (req, res) => {
	const qualification = await Qualification.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			qualification,
		},
	});
});

const getAllQualifications = asyncHandler(async (req, res) => {
	const qualifications = await Qualification.find({});

	res.status(200).json({
		status: 'success',
		data: {
			qualifications,
		},
	});
});
const getQualification = asyncHandler(async (req, res) => {
	const qualification = await Qualification.findById(
		req.params.qualificationId
	);

	if (!qualification) {
		res.status(404);
		throw new Error('Không tìm thấy bằng cấp');
	}

	res.status(200).json({
		status: 'success',
		data: {
			qualification,
		},
	});
});

const deleteQualification = asyncHandler(async (req, res) => {
	const qualification = await Qualification.findById(
		req.params.qualificationId
	);

	if (!qualification) {
		res.status(404);
		throw new Error('Không tìm thấy bằng cấp');
	}

	await Qualification.findByIdAndDelete(req.params.qualificationId);

	res.status(200).json({
		status: 'success',
		data: { id: req.params.qualificationId },
	});
});

const updateQualification = asyncHandler(async (req, res) => {
	const qualification = await Qualification.findById(
		req.params.qualificationId
	);

	if (!qualification) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	const updatedQualification = await Qualification.findByIdAndUpdate(
		req.params.qualificationId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedQualification,
		},
	});
});

const receiveNewQualification = asyncHandler(async (req, res) => {
	const existingDocument = await AccountQualification.findOne({
		accountId: req.params.accountId,
		qualificationId: req.params.qualificationId,
	});

	if (!existingDocument) {
		await AccountQualification.create({
			accountId: req.params.accountId,
			qualificationId: req.params.qualificationId,
		});

		res.status(201).json({
			status: 'success',
			message: 'Qualification is added successfully',
		});
	} else {
		res.status(200).json({
			status: 'success',
			message: 'Qualification has already been added by user',
		});
	}
});

const checkQualificationReceived = asyncHandler(async (req, res) => {
	const existingDocument = await AccountQualification.findOne({
		accountId: req.account._id,
		qualificationId: req.params.qualificationId,
	});

	if (existingDocument) {
		res.status(200).json({
			status: 'received',
		});
	} else {
		res.status(200).json({
			status: 'not_yet',
		});
	}
});

const getAccountQualifications = asyncHandler(async (req, res) => {
	const qualifications = await AccountQualification.find({
		accountId: req.params.accountId,
	}).populate('qualificationId');

	res.status(200).json({
		status: 'success',
		data: {
			qualifications,
		},
	});
});

module.exports = {
	updateQualification,
	deleteQualification,
	getQualification,
	getAllQualifications,
	createQualification,
	receiveNewQualification,
	checkQualificationReceived,
	getAccountQualifications,
};
