const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');

const getAllCourses = asyncHandler(async (req, res) => {
	const courses = await Course.find({});

	res.status(200).json({
		status: 'success',
		data: {
			courses,
		},
	});
});
const getCourse = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.courseId);

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}

	res.status(200).json({
		status: 'success',
		data: {
			course,
		},
	});
});
const createCourse = asyncHandler(async (req, res) => {
	const course = await Course.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			course,
		},
	});
});
const updateCourse = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.courseId);

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}

	const updatedCourse = await Course.findByIdAndUpdate(
		req.params.courseId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedCourse,
		},
	});
});
const deleteCourse = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.courseId);

	if (!course) {
		res.status(404);
		throw new Error('Không tìm thấy khóa học');
	}

	await Course.findByIdAndDelete(req.params.courseId);

	res.status(200).json({
		status: 'success',
		data: { id: req.params.courseId },
	});
});

module.exports = {
	getAllCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
};
