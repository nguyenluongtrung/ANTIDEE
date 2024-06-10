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
	.post(protect, restrict('Admin'), createService)
	.get(getAllServices);
router
	.route('/:serviceId')
	.get(getService)
	.delete(protect, restrict('Admin'), deleteService)
	.patch(protect, restrict('Admin'), updateService);

module.exports = router;