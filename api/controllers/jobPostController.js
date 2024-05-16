const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

const getAllJobPosts = asyncHandler(async (req, res) => {
	const jobPosts = await JobPost.find({}).populate('serviceId');

	res.status(200).json({
		status: 'success',
		data: {
			jobPosts,
		},
	});
});

const getJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.findById(req.params.jobPostId).populate(
		'serviceId'
	);

	if (!jobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	res.status(200).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

const deleteJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.findById(req.params.jobPostId);

	if (!jobPost) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	await JobPost.findByIdAndDelete(req.params.jobPostId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.jobPostId,
		},
	});
});

const updateJobPost = asyncHandler(async (req, res) => {
	const isFountJobPost = await JobPost.findById(req.params.jobPostId);

	if (!isFountJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const jobPost = await JobPost.findByIdAndUpdate(
		req.params.jobPostId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

module.exports = {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	getAllJobPosts,
	createJobPost,
};
