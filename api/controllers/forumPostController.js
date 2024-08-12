const asyncHandler = require("express-async-handler");
const ForumPost = require("../models/forumPostModel");

const createForumPost = asyncHandler(async (req, res) => { });
const deleteForumPost = asyncHandler(async (req, res) => {
	const { forumPostId } = req.params;

	// Tìm bài đăng theo ID
	const forumPost = await ForumPost.findById(forumPostId);

	// Kiểm tra nếu bài đăng không tồn tại
	if (!forumPost) {
		res.status(404);
		throw new Error("Bài đăng không tồn tại");
	}

	// Xóa bài đăng
	await ForumPost.findByIdAndDelete(req.params.forumPostId);

	res.status(200).json({
		status: "success",
		data: {
			id: req.params.forumPostId,
		},
	});
});
const updateForumPost = asyncHandler(async (req, res) => { });
const getAllForumPosts = asyncHandler(async (req, res) => {
	try {
		const forumPosts = await ForumPost.find({});
		res.status(200).json({
			success: true,
			data: { forumPosts },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
});
const getForumPost = asyncHandler(async (req, res) => {
	try {
		const { forumPostId } = req.params;

		const forumPost = await ForumPost.findById(forumPostId);

		if (!forumPost) {
			res.status(404);
			throw new Error("Bài đăng không tồn tại");
		}
		res.status(200).json({
			success: true,
			data: { forumPost },
		})

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
};
