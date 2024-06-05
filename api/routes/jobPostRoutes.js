const express = require('express');
const { protect } = require('../middleware/accountMiddleware');
const {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	createJobPost,
	getAllJobPosts,
	getAJob,
	applyAJob,
} = require('../controllers/jobPostController');

const router = express.Router();

router.route('/').post(protect, createJobPost).get(protect, getAllJobPosts);
router
	.route('/:jobPostId')
	.get(protect, getJobPost)
	.delete(protect, deleteJobPost)
	.patch(protect, updateJobPost);
router.route('/get-a-job/:jobPostId/:accountId').patch(protect, getAJob);
router.route('/apply-a-job/:jobPostId/:accountId').patch(protect, applyAJob);

module.exports = router;
