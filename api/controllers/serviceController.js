const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');
const JobPost = require('../models/jobPostModel');
const AccountService = require('../models/accountServiceModel');

const createService = asyncHandler(async (req, res) => {
	const newService = await Service.create(req.body);

	if (!newService) {
		res.status(500).json({
			status: 'error',
			message: 'Failed to create new service',
		});
		return;
	}

	res.status(201).json({
		status: 'success',
		data: {
			newService,
		},
	});
});
const getAllServices = asyncHandler(async (req, res) => {
	const services = await Service.find({}).populate('requiredQualification');

	res.status(200).json({
		status: 'success',
		data: {
			services,
		},
	});
});
const getService = asyncHandler(async (req, res) => {
	const service = await Service.findById(req.params.serviceId);

	if (!service) {
		res.status(404);
		throw new Error('Không tìm thấy dịch vụ');
	}

	res.status(200).json({
		status: 'success',
		data: {
			service,
		},
	});
});
const deleteService = asyncHandler(async (req, res) => {
	const service = await Service.findById(req.params.serviceId);

	if (!service) {
		res.status(404);
		throw new Error('Không tìm thấy dịch vụ');
	}

	await Service.findByIdAndDelete(req.params.serviceId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.serviceId,
		},
	});
});
const updateService = asyncHandler(async (req, res) => {
	const oldService = await Service.findById(req.params.serviceId);

	if (!oldService) {
		res.status(404);
		throw new Error('Không tìm thấy dịch vụ!');
	}
	const oldServiceIds = oldService.serviceIds;

	await Service.updateMany(
		{ _id: { $in: oldServiceIds } },
		{ $pull: { ServiceIds: req.params.serviceId } }
	);

	const updatedService = await Service.findByIdAndUpdate(
		req.params.serviceId,
		req.body,
		{ new: true }
	);
	await Service.updateMany(
		{ _id: { $in: oldServiceIds } },
		{ $addToSet: { ServiceIds: req.params.serviceId } }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedService,
		},
	});
});
const rankingServices = asyncHandler(async (req, res) => {
	const rankingServices = await JobPost.aggregate([
		{
			$group: {
				_id: '$serviceId',
				totalJobPosts: { $count: {} },
			},
		},
		{
			$lookup: {
				from: 'services',
				localField: '_id',
				foreignField: '_id',
				as: 'service',
			},
		},
		{
			$unwind: '$service',
		},
		{
			$project: {
				_id: 0,
				serviceName: '$service.name',
				totalJobPosts: 1,
			},
		},
	]);

	const services = await Service.find({});
	let serviceNames = [];
	services.forEach((service) => serviceNames.push(service.name));
	const result = {
		categories: [],
		data: [],
	};

	serviceNames.forEach((service) => {
		const foundService = rankingServices.find(
			(svc) => svc.serviceName == service
		);
		if (foundService) {
			result.categories.push(foundService.serviceName);
			result.data.push(foundService.totalJobPosts);
		} else {
			result.categories.push(service);
			result.data.push(0);
		}
	});

	res.status(200).json({
		status: 'success',
		data: {
			rankingServices: result,
		},
	});
});
const ratingService = asyncHandler(async (req, res) => {
	const foundAccountService = await AccountService.findOne({
		accountId: req.account._id,
		serviceId: req.params.serviceId,
	});

	let newRating = Number(req.body.rating);
	let newRatingCount = 1; // Start with a count of 1 for a new entry
	let newRatingService;

	if (foundAccountService) {
		// Retrieve existing rating count and rating point
		const currentRatingCount = foundAccountService.ratingCount || 0;
		const currentRatingPoint = foundAccountService.rating || 0;
		console.log(
			currentRatingPoint,
			currentRatingCount,
			((currentRatingCount * currentRatingPoint + newRating) * 1.0) /
				(currentRatingCount + 1)
		);

		// Calculate new rating and increment count
		newRating =
			((currentRatingCount * currentRatingPoint + newRating) * 1.0) /
			(currentRatingCount + 1);
		newRatingCount = currentRatingCount + 1;

		// Update the existing entry with new rating and count
		newRatingService = await AccountService.findByIdAndUpdate(
			foundAccountService._id,
			{
				accountId: req.account._id,
				serviceId: req.params.serviceId,
				rating: newRating,
				ratingCount: newRatingCount,
				date: new Date(),
			},
			{ new: true }
		);
	} else {
		// Create a new entry for a first-time rating
		newRatingService = await AccountService.create({
			accountId: req.account._id,
			serviceId: req.params.serviceId,
			rating: newRating,
			ratingCount: newRatingCount,
			date: new Date(),
		});
	}

	res.status(201).json({
		status: 'success',
		data: {
			ratingDetail: newRatingService,
		},
	});
});

module.exports = {
	updateService,
	deleteService,
	getService,
	getAllServices,
	createService,
	rankingServices,
	ratingService,
};
