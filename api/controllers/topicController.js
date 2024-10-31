const asyncHandler = require('express-async-handler');
const Topic = require('./../models/topicsModel');
const { ForumPost } = require('../models/forumPostModel');

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

const getMostPopularTopics = asyncHandler(async (req, res) => {
	const popularTopics = await ForumPost.aggregate([
		{ $match: { topic: { $exists: true, $ne: [] } } },

		{ $unwind: '$topic' },

		{
			$group: {
				_id: '$topic',
				count: { $sum: 1 },
			},
		},

		{ $sort: { count: -1 } },

		{ $limit: 3 },

		{
			$lookup: {
				from: 'topics',
				localField: '_id',
				foreignField: '_id',
				as: 'topicDetails',
			},
		},

		{
			$project: {
				topicId: '$_id',
				count: 1,
				topicDetails: { $arrayElemAt: ['$topicDetails', 0] },
			},
		},
	]);

	res.status(200).json(popularTopics);
});

const getAllForumPostsByTopic = asyncHandler(async (req, res) => {
	const { topicId } = req.params;

	const forumPosts = await ForumPost.find({ topic: topicId })
		.populate('topic')
		.populate({
			path: 'author',
			select: 'name avatar role',
		})
		.populate({
			path: 'comments.author', 
			select: 'name avatar',
		});

	res.status(200).json({
		status: 'success',
		data: {
			forumPosts,
		},
	});
});


module.exports = {
	createTopic,
	getAllTopics,
	getMostPopularTopics,
	getAllForumPostsByTopic
};
