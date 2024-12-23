const asyncHandler = require('express-async-handler');
const Video = require('../models/videoModel');
const AccountVideo = require('./../models/accountVideoModel');

const createVideo = asyncHandler(async (req, res) => {
	const video = await Video.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			video,
		},
	});
});

const getAllVideos = asyncHandler(async (req, res) => {
	const videos = await Video.find({});

	res.status(200).json({
		status: 'success',
		data: {
			videos,
		},
	});
});

const getVideo = asyncHandler(async (req, res) => {
	const video = await Video.findById(req.params.videoId);

	if (!video) {
		res.status(404);
		throw new Error('Không tìm thấy video');
	}

	res.status(200).json({
		status: 'success',
		data: {
			video,
		},
	});
});

const deleteVideo = asyncHandler(async (req, res) => {
	const video = await Video.findById(req.params.videoId);

	if (!video) {
		res.status(404);
		throw new Error('Không tìm thấy video');
	}

	await Video.findByIdAndDelete(req.params.videoId);

	res.status(200).json({
		status: 'success',
		data: { id: req.params.videoId },
	});
});

const updateVideo = asyncHandler(async (req, res) => {
	const video = await Video.findById(req.params.videoId);

	if (!video) {
		res.status(404);
		throw new Error('Không tìm thấy video');
	}

	const updatedVideo = await Video.findByIdAndUpdate(
		req.params.videoId,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedVideo,
		},
	});
});

const finishVideoByAccount = asyncHandler(async (req, res) => {
	try {
		const existingDocument = await AccountVideo.findOne({
			accountId: req.params.accountId,
			videoId: req.params.videoId,
		});

		if (!existingDocument) {
			await AccountVideo.create({
				accountId: req.params.accountId,
				videoId: req.params.videoId,
			});

			res.status(201).json({
				status: 'success',
				message: 'Video marked as watched successfully',
			});
		} else {
			res.status(200).json({
				status: 'success',
				message: 'Video has already been watched by the user',
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'An error occurred while updating video status',
			error: error.message,
		});
	}
});

module.exports = {
	createVideo,
	getAllVideos,
	getVideo,
	deleteVideo,
	updateVideo,
	finishVideoByAccount,
};
