const asyncHandler = require("express-async-handler");
const { ForumPost } = require("../models/forumPostModel");
const { PostRepository } = require("./../models/forumPostModel");
const Account = require("../models/accountModel");
const mongoose = require("mongoose");
const { populate } = require("dotenv");
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
		throw new Error("Bài đăng không tồn tại");
	}

	await ForumPost.findByIdAndDelete(req.params.forumPostId);

	res.status(200).json({
		status: "success",
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
			throw new Error("Không tìm thấy bài đăng");
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

		// Tìm tài khoản của người dùng để lấy danh sách các bài đăng đã ẩn
		const account = await Account.findById(userId).exec();

		if (!account) {
			res.status(404);
			throw new Error("Tài khoản không tồn tại");
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
				path: "author",
				select: "name avatar role",
			})
			.populate({
				path: "comments.author",
				select: "avatar name",
			});
		res.status(200).json({
			success: true,
			data: { forumPosts },
		});
	} catch (error) {
		console.error("Error:", error.message);
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

const getForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	const forumPost = await ForumPost.findById(forumPostId).populate({
		path: "author",
		select: "name avatar role",
	});

	if (!forumPost) {
		res.status(404);
		throw new Error("Bài đăng không tồn tại");
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
		status: "success",
		data: {
			repository,
		},
	});
});

const getForumRepositories = asyncHandler(async (req, res) => {
	const repositories = await PostRepository.find({
		account: req.account._id,
	}).populate("postsList.postId");

	res.status(200).json({
		status: "success",
		data: {
			repositories,
		},
	});
});
const hideForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	// Log ID bài viết và ID người dùng
	console.log("Forum Post ID:", forumPostId);
	console.log("User ID:", req.account._id);

	const forumPost = await ForumPost.findById(forumPostId);

	if (!forumPost) {
		res.status(404);
		throw new Error("Bài đăng không tồn tại");
	}

	// Log bài viết trước khi ẩn
	console.log("Forum Post Found:", forumPost);

	// Thêm ID bài viết vào hiddenPost của người dùng nếu chưa có
	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		{ $addToSet: { hiddenPost: forumPostId } }, // Mảng hiddenPost là ObjectId
		{ new: true }
	);

	// Log tài khoản sau khi cập nhật hiddenPost
	console.log("Updated Account:", updatedAccount);

	res.status(200).json({
		status: "success",
		message: "Bài đăng đã được ẩn",
		data: updatedAccount.hiddenPost, // Trả về hiddenPost để kiểm tra
	});
});

const unhideForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	// Tìm kiếm bài viết
	const forumPost = await ForumPost.findById(forumPostId);

	if (!forumPost) {
		res.status(404);
		throw new Error("Bài đăng không tồn tại");
	}

	// Xóa ID bài viết khỏi danh sách hiddenPost của người dùng
	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		{ $pull: { hiddenPost: forumPostId } }, // Xóa ID bài viết khỏi hiddenPost
		{ new: true }
	);

	res.status(200).json({
		status: "success",
		message: "Bài đăng đã được khôi phục",
		data: updatedAccount.hiddenPost,
	});
});

const commentForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;
	const { content, author } = req.body;
	const account = await Account.findById(author);
	const forumPost = await ForumPost.findById(forumPostId).populate({
		path: "comments",
		populate: {
			path: "author",
			select: "avatar name",
		},
	});
	if (!forumPost) {
		return res.status(404).json({
			success: false,
			error: "Không tìm thấy bài đăng.",
		});
	}
	forumPost.comments.push({
		content,
		author: {
			_id: account._id,
			name: account.name,
			avatar:account.avatar,
		},
	});
	await forumPost.save();
	res.status(200).json({
		success: true,
		data: { comments: forumPost.comments },
	});
});

const reactLikesPost = asyncHandler(async (req, res) => {
	try {
		const forumPost = await ForumPost.findById(req.params.forumPostId);
		if (
			forumPost.likeAccounts.find((account) => account == req.params.accountId)
		) {
			forumPost.likeCount = Number(forumPost.likeCount) - 1;
			forumPost.likeAccounts = forumPost.likeAccounts.filter(
				(acc) => String(acc) !== String(req.params.accountId)
			);
		} else {
			forumPost.likeCount = Number(forumPost.likeCount) + 1;
			forumPost.likeAccounts.push(req.params.accountId);
		}
		const newForumPost = await forumPost.save();
		res.status(200).json({
			status: 'success',
			data: {
				discussion: newForumPost,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});

const reactDislikesPost = asyncHandler(async (req, res) => {
	try {
		const forumPost = await ForumPost.findById(req.params.forumPostId);
		if (
			forumPost.dislikeAccounts.find((account) => account == req.params.accountId)
		) {
			forumPost.dislikeCount = Number(forumPost.dislikeCount) - 1;
			forumPost.dislikeAccounts = forumPost.dislikeAccounts.filter(
				(acc) => String(acc) !== String(req.params.accountId)
			);
		} else {
			forumPost.dislikeCount = Number(forumPost.dislikeCount) + 1;
			forumPost.dislikeAccounts.push(req.params.accountId);
		}
		const newForumPost = await forumPost.save();
		res.status(200).json({
			status: 'success',
			data: {
				discussion: newForumPost,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
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
	reactLikesPost,
	reactDislikesPost,
};
