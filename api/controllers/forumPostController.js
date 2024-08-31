const asyncHandler = require('express-async-handler');
const { ForumPost } = require('../models/forumPostModel');
const { PostRepository } = require('./../models/forumPostModel');

const createForumPost = asyncHandler(async (req, res) => {});
const deleteForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	// Tìm bài đăng theo ID
	const forumPost = await ForumPost.findById(forumPostId);

	// Kiểm tra nếu bài đăng không tồn tại
	if (!forumPost) {
		res.status(404);
		throw new Error('Bài đăng không tồn tại');
	}

	// Xóa bài đăng
	await ForumPost.findByIdAndDelete(req.params.forumPostId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.forumPostId,
		},
	});
});
const updateForumPost = asyncHandler(async (req, res) => {});
const getAllForumPosts = asyncHandler(async (req, res) => {
	const forumPosts = await ForumPost.find({})
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
	// .populate('postsList.postId.author');

	res.status(200).json({
		status: 'success',
		data: {
			repositories,
		},
	});
});

module.exports = {
	createForumPost,
	deleteForumPost,
	updateForumPost,
	getAllForumPosts,
	getForumPost,
	saveForumPost,
	getForumRepositories,
};
