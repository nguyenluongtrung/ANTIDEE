const express = require('express');
const { protect, restrictToOwner } = require('../middleware/accountMiddleware');
const {
  getAllForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  getForumPost,
  hideForumPost,
  unhideForumPost,
} = require("../controllers/forumPostController");

const router = express.Router();

// Route để lấy tất cả bài viết, yêu cầu người dùng phải đăng nhập
router
	.route('/')
	.get(protect, getAllForumPosts)  // Bổ sung 'protect' để lấy bài viết dựa trên thông tin người dùng
	.post(protect, createForumPost); // Người dùng phải đăng nhập để tạo bài viết

// Route cho từng bài viết cụ thể (Xem, cập nhật, xóa)
router
	.route('/:forumPostId')
	.get(getForumPost) // Không yêu cầu đăng nhập để xem bài viết
	.patch(protect, restrictToOwner, updateForumPost) // Chỉ chủ sở hữu mới được cập nhật bài viết
	.delete(protect, restrictToOwner, deleteForumPost); // Chỉ chủ sở hữu mới được xóa bài viết

// Route để ẩn bài viết
router
	.route('/:forumPostId/hide')
	.patch(protect, hideForumPost); // Người dùng phải đăng nhập để ẩn bài viết

router.patch("/:forumPostId/unhide", protect, unhideForumPost);

module.exports = router;
