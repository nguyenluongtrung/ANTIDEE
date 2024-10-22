const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createQualification,
	getAllQualifications,
	getQualification,
	deleteQualification,
	updateQualification,
	receiveNewQualification,
	checkQualificationReceived,
	getAccountQualifications,
} = require('../controllers/qualificationController');

const router = express.Router();

router
	.route('/')
	.post(protect, restrict('Admin'), createQualification)
	.get(getAllQualifications);
router
	.route('/receive/:qualificationId/:accountId')
	.get(checkQualificationReceived)
	.post(receiveNewQualification);
router
	.route('/get-account-qualifications/:accountId')
	.get(getAccountQualifications);
router
	.route('/:qualificationId')
	.get(protect, restrict('Admin'), getQualification)
	.delete(protect, restrict('Admin'), deleteQualification)
	.patch(protect, restrict('Admin'), updateQualification);

module.exports = router;
