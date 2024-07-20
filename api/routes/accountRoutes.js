const express = require('express');
const {
	login,
	register,
	updateAccountInformation,
	getAccountInformation,
	getAllAccounts,
	updateAccountForgottenPassword,
	getAccountForgottenPassword,
	addDomesticHelperToBlackList,
	addDomesticHelperToFavoriteList,
	deleteDomesticHelperFromBlackList,
	deleteDomesticHelperFromFavoriteList,
	inviteFriend,
	updateRatingDomesticHelper,
	checkInvitationCode,
	loadMoneyAfterUsingInvitationCode,
	getDomesticHelpersRanking,
	getAccountBalance,
} = require('../controllers/accountController');
const { protect, restrict } = require('../middleware/accountMiddleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);

router
	.route('/information')
	.patch(protect, updateAccountInformation)
	.get(protect, getAccountInformation);
router
	.route('/check-invite-friend/:invitationCode')
	.get(protect, checkInvitationCode);
router.route('/').get(getAllAccounts);
router.route('/lost-account/:phoneNumber').get(getAccountForgottenPassword);
router.route('/lost-account/:accountId').patch(updateAccountForgottenPassword);
router.route('/invite-friend').patch(protect, inviteFriend);
router.route('/account-balance/:accountId').patch(getAccountBalance);
router
	.route('/load-money/:ownerId')
	.patch(protect, loadMoneyAfterUsingInvitationCode);
router
	.route('/rating/:domesticHelperId')
	.patch(protect, updateRatingDomesticHelper);
router
	.route('/ranking-domestic-helper')
	.get(
		protect,
		restrict('Admin', 'Người giúp việc'),
		getDomesticHelpersRanking
	);
router
	.route('/blackList/:domesticHelperId')
	.post(protect, addDomesticHelperToBlackList)
	.delete(protect, deleteDomesticHelperFromBlackList);
router
	.route('/favoriteList/:domesticHelperId')
	.post(protect, addDomesticHelperToFavoriteList)
	.delete(protect, deleteDomesticHelperFromFavoriteList);

module.exports = router;
