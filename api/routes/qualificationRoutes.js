const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createQualification,
	getAllQualifications,
	getQualification,
	deleteQualification,
	updateQualification,
} = require('../controllers/qualificationController');

const router = express.Router();

router
	.route('/')
	.post(protect, restrict('admin'), createQualification)
	.get(protect, restrict('admin'), getAllQualifications);
router
	.route('/:qualificationId')
	.get(protect, restrict('admin'), getQualification)
	.delete(protect, restrict('admin'), deleteQualification)
	.patch(protect, restrict('admin'), updateQualification);

module.exports = router;
