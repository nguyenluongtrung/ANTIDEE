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
			});
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

	const forumPost = await ForumPost.findById(forumPostId).populate({
		path: 'author',
		select: 'name avatar role',
	});

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
		.populate('author')
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
		.populate('author')
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
};
