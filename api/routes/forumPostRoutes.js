const express = require('express');
const { protect, restrictToOwner } = require('../middleware/accountMiddleware');
const {
  getAllForumPosts,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  getForumPost,
} = require("../controllers/forumPostController");
const router = express.Router();

router
	.route('/')
	.get(getAllForumPosts)
	.post(protect, createForumPost);

router
	.route('/:forumPostId')
	.get(getForumPost)
	.patch(protect, restrictToOwner, updateForumPost)
	.delete(protect, restrictToOwner, deleteForumPost);

module.exports = router;
