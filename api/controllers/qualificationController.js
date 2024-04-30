const asyncHandler = require('express-async-handler');
const Qualification = require('../models/qualificationModel');

const createQualification = asyncHandler(async (req, res) => {});
const getAllQualifications = asyncHandler(async (req, res) => {});
const getQualification = asyncHandler(async (req, res) => {});
const deleteQualification = asyncHandler(async (req, res) => {});
const updateQualification = asyncHandler(async (req, res) => {});

module.exports = {
	updateQualification,
	deleteQualification,
	getQualification,
	getAllQualifications,
	createQualification,
};
