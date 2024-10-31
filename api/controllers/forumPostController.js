const asyncHandler = require('express-async-handler');
const { ForumPost } = require('../models/forumPostModel');
const { PostRepository } = require('./../models/forumPostModel');
const Account = require('../models/accountModel');
const mongoose = require('mongoose');

const createForumPost = asyncHandler(async (req, res) => {
	try {
		const newForumPost = await ForumPost.create({
			...req.body,
			author: req.account._id,
		});
		res.status(201).json({
			success: true,
			data: newForumPost,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});

const getTopDiscussions = asyncHandler(async (req, res) => {
	const topDiscussions = await ForumPost.aggregate([
		{
			$addFields: {
				commentsCount: { $size: '$comments' },
				likesCount: { $size: '$likes' },
			},
		},
		{
			$sort: { commentsCount: -1, likesCount: -1 },
		},
		{
			$limit: 5,
		},
		{
			$lookup: {
				from: 'topics',
				localField: 'topic',
				foreignField: '_id',
				as: 'topicDetails',
			},
		},
		{
			$project: {
				forumPostId: '$_id',
				commentsCount: 1,
				title: 1,
				'topicDetails.topicName': 1,
			},
		},
	]);

	res.status(200).json(topDiscussions);
});

const deleteForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	const forumPost = await ForumPost.findById(forumPostId);

	if (!forumPost) {
		res.status(404);
		throw new Error('Bài đăng không tồn tại');
	}

	await ForumPost.findByIdAndDelete(req.params.forumPostId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.forumPostId,
		},
	});
});

const updateForumPost = asyncHandler(async (req, res) => {
	try {
		const forumPost = await ForumPost.findById(req.params.forumPostId);

		if (!forumPost) {
			res.status(404);
			throw new Error('Không tìm thấy bài đăng');
		}

		const updatedForumPost = await ForumPost.findByIdAndUpdate(
			req.params.forumPostId,
			req.body,
			{
				new: true,
			}
		);

		res.status(200).json({
			success: true,
			data: updatedForumPost,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
});

const getAllForumPosts = asyncHandler(async (req, res) => {
	try {
		const userId = req.account._id;

		const account = await Account.findById(userId).exec();

		if (!account) {
			res.status(404);
			throw new Error('Tài khoản không tồn tại');
		}
		const hiddenPosts = account.hiddenPost || [];
		const hiddenPostsObjectId = hiddenPosts.map(
			(id) => new mongoose.Types.ObjectId(id)
		);
		const hiddenPostsCheck = await ForumPost.find({
			_id: { $in: hiddenPostsObjectId },
		});
		const forumPosts = await ForumPost.find({
			_id: { $nin: hiddenPostsObjectId },
		})
			.populate({
				path: 'author',
				select: 'name avatar role',
			})
			.populate({
				path: 'comments.author',
				select: 'avatar name',
			})
			.populate('topic');
		res.status(200).json({
			success: true,
			data: { forumPosts },
		});
	} catch (error) {
		console.error('Error:', error.message);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

const getForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	const forumPost = await ForumPost.findById(forumPostId)
		.populate({
			path: 'author',
			select: 'name avatar role',
		})
		.populate({
			path: 'comments.author',
			select: 'avatar name',
		})
		.populate('topic');

	if (!forumPost) {
		res.status(404);
		throw new Error('Bài đăng không tồn tại');
	}
	res.status(200).json({
		success: true,
		data: { forumPost },
	});
});

const saveForumPost = asyncHandler(async (req, res) => {
	const repositoryExists = await PostRepository.findOne({
		repositoryName: req.body.repositoryName,
	});
	let repository;
	if (!repositoryExists) {
		repository = await PostRepository.create({
			repositoryName: req.body.repositoryName,
			postsList: [
				{
					postId: req.params.forumPostId,
				},
			],
			account: req.account._id,
		});
	} else {
		repositoryExists.postsList.push({
			postId: req.params.forumPostId,
		});
		repository = repositoryExists;
		await repositoryExists.save();
	}
	res.status(201).json({
		status: 'success',
		data: {
			repository,
		},
	});
});

const getForumRepositories = asyncHandler(async (req, res) => {
	const repositories = await PostRepository.find({
		account: req.account._id,
	}).populate('postsList.postId');

	res.status(200).json({
		status: 'success',
		data: {
			repositories,
		},
	});
});

const hideForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	const forumPost = await ForumPost.findById(forumPostId);

	if (!forumPost) {
		res.status(404);
		throw new Error('Bài đăng không tồn tại');
	}

	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		{ $addToSet: { hiddenPost: forumPostId } },
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		message: 'Bài đăng đã được ẩn',
		data: updatedAccount.hiddenPost,
	});
});

const unhideForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	const forumPost = await ForumPost.findById(forumPostId);

	if (!forumPost) {
		res.status(404);
		throw new Error('Bài đăng không tồn tại');
	}

	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		{ $pull: { hiddenPost: forumPostId } },
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		message: 'Bài đăng đã được khôi phục',
		data: updatedAccount.hiddenPost,
	});
});

const commentForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;
	const { content, author } = req.body;
	const account = await Account.findById(author);
	const forumPost = await ForumPost.findById(forumPostId).populate({
		path: 'comments',
		populate: {
			path: 'author',
			select: 'avatar name',
		},
	});
	if (!forumPost) {
		return res.status(404).json({
			success: false,
			error: 'Không tìm thấy bài đăng.',
		});
	}
	forumPost.comments.push({
		content,
		author: {
			_id: account._id,
			name: account.name,
			avatar: account.avatar,
		},
	});
	await forumPost.save();
	res.status(200).json({
		success: true,
		data: { comments: forumPost.comments },
	});
});

const reactToForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;
	const { userId } = req.body;

	const forumPost = await ForumPost.findById(forumPostId)
		.populate('author topic')
		.populate({
			path: 'comments',
			populate: {
				path: 'author',
				select: 'avatar name',
			},
		});

	if (!forumPost.likes.includes(userId)) {
		forumPost.likes.push(userId);
		await forumPost.save();
		res.status(200).json({
			success: true,
			data: { forumPost },
		});
	}
});

const unReactToForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;
	const { userId } = req.body;

	const forumPost = await ForumPost.findById(forumPostId)
		.populate('author topic')
		.populate({
			path: 'comments',
			populate: {
				path: 'author',
				select: 'avatar name',
			},
		});
	if (forumPost.likes.includes(userId)) {
		forumPost.likes = forumPost.likes.filter((id) => id != userId);
		await forumPost.save();
		res.status(200).json({
			success: true,
			data: { forumPost },
		});
	}
});

const updateHiddenDetails = async (req, res) => {
	const { postId } = req.params;
	const { accountId, reasonContent, status } = req.body;

	try {
		const post = await ForumPost.findById(postId);
		if (!post) {
			return res.status(404).json({ message: 'Post not found' });
		}

		post.hiddenDetails.reasons.push({
			accountId: accountId,
			content: reasonContent,
			update: new Date(),
		});
		post.hiddenDetails.status = status !== undefined ? status : false;

		await post.save();

		return res
			.status(200)
			.json({ message: 'Hidden details updated successfully', post });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating hidden details', error });
	}
};

module.exports = {
	createForumPost,
	deleteForumPost,
	updateForumPost,
	getAllForumPosts,
	getForumPost,
	saveForumPost,
	getForumRepositories,
	hideForumPost,
	unhideForumPost,
	commentForumPost,
	reactToForumPost,
	unReactToForumPost,
	updateHiddenDetails,
	getTopDiscussions,
};
