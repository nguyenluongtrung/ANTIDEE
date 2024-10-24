 const asyncHandler = require('express-async-handler');
const Topic = require('./../models/topicsModel'); 

const createTopic = asyncHandler(async (req, res) => {
	const topic = await Topic.create(req.body);

	res.status(201).json({
		status: 'success',
		data: {
			topic,
		},
	});
});

const getAllTopics = asyncHandler(async (req, res) => {
	const topics = await Topic.find({});

	res.status(200).json({
		status: 'success',
		data: {
			topics,
		},
	});
});

module.exports = {
    createTopic,
    getAllTopics,
};