const express = require('express');
const {
	login,
	register,
	updateAccountInformation,
	getAccountInformation,
} = require('../controllers/accountController');
const { protect } = require('../middleware/accountMiddleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router
	.route('/information')
	.patch(protect, updateAccountInformation)
	.get(protect, getAccountInformation);

module.exports = router;
