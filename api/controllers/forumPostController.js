const asyncHandler = require("express-async-handler");
const ForumPost = require("../models/forumPostModel");
const Account = require('../models/accountModel');
const mongoose = require('mongoose');
// Tạo bài viết trên diễn đàn
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

// Xóa bài viết
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

// Cập nhật bài viết
const updateForumPost = asyncHandler(async (req, res) => {
	try {
		const forumPost = await ForumPost.findById(req.params.forumPostId);

		if (!forumPost) {
			res.status(404);
			throw new Error('Không tìm thấy bài đăng');
		}

		const updatedForumPost = await ForumPost.findByIdAndUpdate(
			req.params.forumPostId, 
			req.body, {
			new: true
		});

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

// Lấy tất cả bài viết, trừ những bài đã bị ẩn
const getAllForumPosts = asyncHandler(async (req, res) => {
    try {
        const userId = req.account._id;

        // Tìm tài khoản của người dùng để lấy danh sách các bài đăng đã ẩn
        const account = await Account.findById(userId).exec();

        if (!account) {
            res.status(404);
            throw new Error("Tài khoản không tồn tại");
        }

        console.log("Account Data:", account);

        // Lấy danh sách các bài đăng đã ẩn từ tài khoản của người dùng
        const hiddenPosts = account.hiddenPost || [];  // Gán giá trị mặc định là mảng rỗng nếu không tồn tại
        console.log("Hidden Posts Array:", hiddenPosts);

        // Chuyển đổi các ID thành ObjectId
        const hiddenPostsObjectId = hiddenPosts.map(id => new mongoose.Types.ObjectId(id)); // Sử dụng new
        console.log("Hidden Posts ObjectId:", hiddenPostsObjectId);

        // Kiểm tra các bài đăng bị ẩn
        const hiddenPostsCheck = await ForumPost.find({
            _id: { $in: hiddenPostsObjectId }
        });
        console.log("Hidden Posts Check:", hiddenPostsCheck);

        // Lấy tất cả các bài đăng trừ những bài đã bị ẩn
        const forumPosts = await ForumPost.find({
            _id: { $nin: hiddenPostsObjectId }  // Lọc ra những bài không nằm trong hiddenPost
        })
        .populate({
            path: 'author',
            select: 'name avatar role', 
        })
        .populate({
            path: 'comments.author',
            select: 'avatar name', 
        });
        console.log("Filtered Forum Posts:", forumPosts);

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


// Lấy một bài viết cụ thể
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
		});

	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
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
		{ $addToSet: { hiddenPost: forumPostId } },  // Mảng hiddenPost là ObjectId
		{ new: true }
	);

	// Log tài khoản sau khi cập nhật hiddenPost
	console.log("Updated Account:", updatedAccount);

	res.status(200).json({
		status: "success",
		message: "Bài đăng đã được ẩn",
		data: updatedAccount.hiddenPost,  // Trả về hiddenPost để kiểm tra
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
		{ $pull: { hiddenPost: forumPostId } },  // Xóa ID bài viết khỏi hiddenPost
		{ new: true }
	);

	res.status(200).json({
		status: "success",
		message: "Bài đăng đã được khôi phục",
		data: updatedAccount.hiddenPost,
	});
});

module.exports = {
	createForumPost,
	deleteForumPost,
	updateForumPost,
	getAllForumPosts,
	getForumPost,
	hideForumPost,
	unhideForumPost
};
