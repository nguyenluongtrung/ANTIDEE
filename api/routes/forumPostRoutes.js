const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	getAllForumPosts,
	createForumPost,
	updateForumPost,
	deleteForumPost,
	getForumPost,
} = require('../controllers/forumPostController');
const router = express.Router();

router.route('/').get(getAllForumPosts).post(createForumPost);
router
	.route('/:forumPostId')
	.get(getForumPost)
	.patch(updateForumPost)
	.delete(deleteForumPost);

module.exports = router;
