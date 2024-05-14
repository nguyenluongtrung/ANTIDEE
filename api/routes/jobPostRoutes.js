const express = require('express');
const { protect } = require('../middleware/accountMiddleware');
const {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	createJobPost,
	getAllJobPosts,
} = require('../controllers/jobPostController');

const router = express.Router();

router.route('/').post(protect, createJobPost).get(protect, getAllJobPosts);
router
	.route('/:jobPostId')
	.get(protect, getJobPost)
	.delete(protect, deleteJobPost)
	.patch(protect, updateJobPost);

module.exports = router;
