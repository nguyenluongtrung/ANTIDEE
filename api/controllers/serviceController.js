const asyncHandler = require('express-async-handler');
const Service = require('../models/serviceModel');

const createService = asyncHandler(async (req, res) => {});
const getAllServices = asyncHandler(async (req, res) => {
	const services = await Service.find({});

	res.status(200).json({
		status: 'success',
		data: {
			services,
		},
	});
});
const getService = asyncHandler(async (req, res) => {});
const deleteService = asyncHandler(async (req, res) => {});
const updateService = asyncHandler(async (req, res) => {});

module.exports = {
	updateService,
	deleteService,
	getService,
	getAllServices,
	createService,
};
