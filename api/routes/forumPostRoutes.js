const express = require('express');
const { protect, restrictToOwner } = require('../middleware/accountMiddleware');
const {
	getAllForumPosts,
	createForumPost,
	updateForumPost,
	deleteForumPost,
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
} = require('../controllers/forumPostController');
const router = express.Router();

router.route('/').get(protect, getAllForumPosts).post(protect, createForumPost);
router.route('/repositories').get(protect, getForumRepositories);
router.route('/top-discussions').get(getTopDiscussions);
router
	.route('/:forumPostId')
	.get(getForumPost)
	.patch(protect, restrictToOwner, updateForumPost)
	.delete(protect, restrictToOwner, deleteForumPost);
router.route('/comment/:forumPostId').post(protect, commentForumPost);
router.route('/react/:forumPostId').patch(protect, reactToForumPost);
router.route('/un-react/:forumPostId').patch(protect, unReactToForumPost);
router.route('/save-forum-post/:forumPostId').post(protect, saveForumPost);
router.route('/:forumPostId/hide').patch(protect, hideForumPost);
router.patch('/:forumPostId/unhide', protect, unhideForumPost);
router.patch('/:postId/hidden-details', protect, updateHiddenDetails);

module.exports = router;
