const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	createJobPost,
	getAllJobPosts,
	getAJob,
	applyAJob,
	selectATasker,
	deleteAllJobPost,
	cancelAJob,
	cancelAJobDomesticHelper,
	countNumberOfJobPostByAccountId,
} = require('../controllers/jobPostController');

const router = express.Router();

router
	.route('/')
	.post(protect, createJobPost)
	.get(protect, getAllJobPosts)
	.delete(protect, restrict('Admin'), deleteAllJobPost);
router.route('/get-a-job/:jobPostId/:accountId').patch(protect, getAJob);
router.route('/apply-a-job/:jobPostId/:accountId').patch(protect, applyAJob);
router
	.route('/select-a-job/:jobPostId/:taskerId')
	.patch(protect, selectATasker);
router.route('/cancel-a-job/:jobPostId').patch(protect, cancelAJob);
router
	.route('/cancel-a-job-domesticHelper/:jobPostId')
	.patch(protect, cancelAJobDomesticHelper);
router
	.route('/countNumberOfJobsByAccountId')
	.get(protect, restrict('Admin'), countNumberOfJobPostByAccountId);
router
	.route('/:jobPostId')
	.get(protect, getJobPost)
	.delete(protect, deleteJobPost)
	.patch(protect, updateJobPost);

module.exports = router;
