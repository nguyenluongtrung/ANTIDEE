const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

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
module.exports = {
	updateService,
	deleteService,
	getService,
	getAllServices,
	createService,
};
