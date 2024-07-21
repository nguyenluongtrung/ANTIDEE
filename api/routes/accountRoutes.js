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
	updateAPoint,
	updateIsUsedVoucher,
	getDomesticHelpersTotalWorkingHours,
	updateDomesticHelperLevel,
	receiveGiftHistory,
	blockAccount,
	updateRole,
	getAllReports,
	getAccountBalance,
} = require('../controllers/accountController');
const { protect, restrict } = require('../middleware/accountMiddleware');
const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/block/:accountId').patch(blockAccount);
router.route('/update-role/:accountId').patch(updateRole);
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
	.get(protect, getDomesticHelpersRanking);
router
	.route('/journey-working/:domesticHelperId')
	.get(getDomesticHelpersTotalWorkingHours);
router
	.route('/journey-level/:domesticHelperId')
	.patch(updateDomesticHelperLevel);
router.route('/receive-gift/:domesticHelperId').patch(receiveGiftHistory);
router
	.route('/blackList/:domesticHelperId')
	.post(protect, addDomesticHelperToBlackList)
	.delete(protect, deleteDomesticHelperFromBlackList);
router
	.route('/favoriteList/:domesticHelperId')
	.post(protect, addDomesticHelperToFavoriteList)
	.delete(protect, deleteDomesticHelperFromFavoriteList);

router.route('/isUsed/:voucherId').patch(updateIsUsedVoucher);

router.route('/update-apoints/:accountId').patch(updateAPoint);
router.route('/report').get(protect, restrict('Admin'), getAllReports);
module.exports = router;
