const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
	createService,
	getService,
	getAllServices,
	deleteService,
	updateService,
} = require('../controllers/serviceController');

const router = express.Router();

router
	.route('/')
	.post(protect, restrict('admin'), createService)
	.get(protect, restrict('admin'), getAllServices);
router
	.route('/:serviceId')
	.get(protect, restrict('admin'), getService)
	.delete(protect, restrict('admin'), deleteService)
	.patch(protect, restrict('admin'), updateService);

module.exports = router;
