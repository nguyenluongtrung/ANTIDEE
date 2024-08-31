const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	getAllForumPosts,
	createForumPost,
	updateForumPost,
	deleteForumPost,
	getForumPost,
	saveForumPost,
	getForumRepositories,
} = require('../controllers/forumPostController');
const router = express.Router();

router.route('/').get(getAllForumPosts).post(createForumPost);
router.route('/repositories').get(protect, getForumRepositories);
router
	.route('/:forumPostId')
	.get(getForumPost)
	.patch(updateForumPost)
	.delete(deleteForumPost);
router.route('/save-forum-post/:forumPostId').post(protect, saveForumPost);

module.exports = router;
