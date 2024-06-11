const asyncHandler = require('express-async-handler');
const Promotion = require('./../models/promotionModel');
const Service = require('./../models/serviceModel');
const Account = require('../models/accountModel');
const sendMail = require('../config/emailConfig');

const getAllPromotions = asyncHandler(async (req, res) => {
	const promotions = await Promotion.find({
		startDate: { $lte: Date.now() },
		endDate: { $gte: Date.now() },
	}).populate('serviceIds', 'name description');

	res.status(200).json({
		status: 'success',
		data: {
			promotions,
		},
	});
});

const getPromotion = asyncHandler(async (req, res) => {
	const promotion = await Promotion.findOne({
		_id: req.params.promotionId,
		startDate: { $lte: Date.now() },
		endDate: { $gte: Date.now() },
	});

	if (!promotion) {
		res.status(404);
		throw new Error('Promotion not found!');
	}

	res.status(200).json({
		status: 'success',
		data: {
			promotion,
		},
	});
});

const updatePromotion = asyncHandler(async (req, res) => {
	const oldPromotion = await Promotion.findById(req.params.promotionId);

	if (!oldPromotion) {
		res.status(404);
		throw new Error('Promotion not found!');
	}

	const { serviceIds } = req.body;
	const oldServiceIds = oldPromotion.serviceIds;

	await Service.updateMany(
		{ _id: { $in: oldServiceIds } },
		{ $pull: { promotionIds: req.params.promotionId } }
	);

	const updatedPromotion = await Promotion.findByIdAndUpdate(
		req.params.promotionId,
		req.body,
		{ new: true }
	);

	await Service.updateMany(
		{ _id: { $in: serviceIds } },
		{ $addToSet: { promotionIds: req.params.promotionId } }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedPromotion,
		},
	});
});

const deletePromotion = asyncHandler(async (req, res) => {
	const oldPromotion = await Promotion.findById(req.params.promotionId);

	if (!oldPromotion) {
		res.status(404);
		throw new Error('Promotion not found!');
	}

	const oldServiceIds = oldPromotion.serviceIds;
	await Service.updateMany(
		{ _id: { $in: oldServiceIds } },
		{ $pull: { promotionIds: req.params.promotionId } }
	);

	await Promotion.findByIdAndDelete(req.params.promotionId);

	res.status(200).json({
		status: 'success',
		data: {
			oldPromotion,
		},
	});
});

// const createPromotion = asyncHandler(async (req, res) => {
// 	const { serviceIds } = req.body;
// 	const newPromotion = await Promotion.create(req.body);

// 	await Service.updateMany(
// 		{ _id: { $in: serviceIds } },
// 		{ $addToSet: { promotionIds: newPromotion._id } }
// 	);

// 	res.status(201).json({
// 		status: 'success',
// 		data: {
// 			newPromotion,
// 		},
// 	});
// });

const createPromotion = asyncHandler(async (req, res) => {
	try {
		const { serviceIds } = req.body;
	const newPromotion = await Promotion.create(req.body);

	await Service.updateMany(
		{ _id: { $in: serviceIds } },
		{ $addToSet: { promotionIds: newPromotion._id } }
	);

		const accounts = await Account.find({});

		for (let account of accounts) {
			await sendMail({
				email: account.email,
				subject: 'New Promotion Available!',
				html: `<p>Dear ${account.name},</p><p>A new promotion is available. Click to view it.</p>`,
			});
		}
		res.status(201).json({
			success: true,
			data: voucher,
		});
	} catch (error) {
		console.error('Error creating voucher or sending emails:', error);
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});

module.exports = {
	getAllPromotions,
	getPromotion,
	updatePromotion,
	deletePromotion,
	createPromotion,
};