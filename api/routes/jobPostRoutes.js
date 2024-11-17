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
	getRevenueByCurrentMonth,
	getRevenueByMonths,
	filterJobPostsByService,
} = require('../controllers/jobPostController');

const router = express.Router();

router
	.route('/')
	.post(protect, createJobPost)
	.get(getAllJobPosts)
	.delete(protect, restrict('Admin'), deleteAllJobPost);
router.route('/filter-jobs').get(protect, filterJobPostsByService);
router.route('/get-a-job/:jobPostId').patch(protect, getAJob);
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
	.route('/get-revenue-by-current-month')
	.get(protect, restrict('Admin'), getRevenueByCurrentMonth);
router
	.route('/get-revenue-by-months')
	.get(protect, restrict('Admin'), getRevenueByMonths);
router
	.route('/:jobPostId')
	.get(getJobPost)
	.delete(protect, deleteJobPost)
	.patch(protect, updateJobPost);

module.exports = router;
