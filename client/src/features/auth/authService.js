import axios from 'axios';

const API_URL = '/antidee/api/accounts/';

const login = async (accountData) => {
	const response = await axios.post(API_URL + 'login', accountData);

	if (response.data) {
		localStorage.setItem('account', JSON.stringify(response.data));
	}

	return response.data.data.account;
};

const register = async (accountData) => {
	const response = await axios.post(API_URL + 'register', accountData);
	return response.data.data.account;
};

const getAllAccounts = async (token) => {
	const response = await axios.get(API_URL);
	return response.data.data.accounts;
};

const logout = async () => {
	localStorage.removeItem('account');
};

const updateAccountInformation = async (accountData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'information',
		accountData,
		config
	);
	return response.data.data.updatedAccount;
};

const updateAccountForgottenPassword = async (password, accountId) => {
	const response = await axios.patch(API_URL + 'lost-account/' + accountId, {
		password,
	});
	console.log('RESPONSE', response.data);
	return response.data.data.updatedAccount;
};

const updateIsUsedVoucher = async (accountId, voucherId, isUsed, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		`${API_URL}isUsed/${voucherId}`,
		{
			accountId,
			isUsed,
		},
		config
	);

	console.log('RESPONSE', response.data);
	return response.data.data.account;
};

const getAccountForgottenPassword = async (phoneNumber) => {
	const response = await axios.get(API_URL + `lost-account/${phoneNumber}`);
	console.log('RESPONSE', response.data.data.singleAccount);
	return response.data.data.singleAccount;
};

const getAccountInformation = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + 'information', config);
	return response.data.data.account;
};

const addDomesticHelperToBlackList = async (domesticHelperId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.post(
		API_URL + 'blackList/' + domesticHelperId,
		null,
		config
	);
	return response.data.data.account;
};

const deleteDomesticHelperFromBlackList = async (domesticHelperId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.delete(
		API_URL + 'blackList/' + domesticHelperId,
		config
	);
	return response.data.data.account;
};

const addDomesticHelperToFavoriteList = async (domesticHelperId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.post(
		API_URL + 'favoriteList/' + domesticHelperId,
		null,
		config
	);
	return response.data.data.account;
};

const deleteDomesticHelperFromFavoriteList = async (
	domesticHelperId,
	token
) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.delete(
		API_URL + 'favoriteList/' + domesticHelperId,
		config
	);
	return response.data.data.account;
};

const inviteFriend = async (
	invitedEmail,
	invitationCode,
	accountName,
	token
) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	await axios.patch(
		API_URL + 'invite-friend/',
		{ invitedEmail, invitationCode, accountName },
		config
	);
};

const updateRatingDomesticHelper = async (
	ratingData,
	domesticHelperId,
	token
) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'rating/' + domesticHelperId,
		ratingData,
		config
	);
	return response.data.data.account;
};

const checkInvitationCode = async (invitationCode, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL + `check-invite-friend/${invitationCode}`,
		config
	);
	return response.data.data.accountId;
};

const loadMoneyAfterUsingInvitationCode = async (ownerId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	await axios.patch(API_URL + `load-money/${ownerId}`, {}, config);
};

const getDomesticHelpersRanking = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + 'ranking-domestic-helper', config);
	console.log(response.data);
	return response.data.data.accountsWithRankingCriteria;
};

const updateAPoint = async (accountId, aPoints, apoint, serviceId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.patch(
		API_URL + `update-apoints/${accountId}`,
		{aPoints, apoint, serviceId },
		config
	);
	return response.data.data.account;
};

const updateRole = async (accountId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	console.log(API_URL + 'update-role/' + accountId);
	const response = await axios.patch(
		API_URL + 'update-role/' + accountId,
		{},
		config
	);
	return response.data.data.updatedAccount;
};

const getAccountBalance = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + 'balance', config);
	return response.data.data.accountBalance;
};

const getDomesticHelpersTotalWorkingHours = async (domesticHelperId) => {
	const response = await axios.get(
		API_URL + 'journey-working/' + domesticHelperId
	);
	console.log('Jouney Working Time Service', response.data.data);
	return response.data.data;
};

const updateDomesticHelperLevel = async (domesticHelperId) => {
	const response = await axios.patch(
		API_URL + 'journey-level/' + domesticHelperId
	);
	console.log('Jouney Working Time Service', response.data.data);
	return response.data.data;
};

const receiveGiftHistory = async (domesticHelperId, levelName, levelApoint) => {
	const response = await axios.patch(
		API_URL + 'receive-gift/' + domesticHelperId,
		{ levelName, levelApoint }
	);
	return response.data.data.updatedAccount;
};
const blockAccountChange = async (accountId) => {
	const response = await axios.patch(
		API_URL + '/block/' + accountId,
		accountId
	);
	return response.data.data.accountId;
};
const getAllReports = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + 'report', config);
	return response.data.data;
};
const getTransactionHistory = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get('/antidee/api/transactions', config);
	console.log(response.data);
	return response.data;
};

const authService = {
	login,
	logout,
	register,
	getAllAccounts,
	updateAccountInformation,
	getAccountInformation,
	updateAccountForgottenPassword,
	getAccountForgottenPassword,
	addDomesticHelperToBlackList,
	deleteDomesticHelperFromBlackList,
	addDomesticHelperToFavoriteList,
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
	blockAccountChange,
	updateRole,
	getAllReports,
	getTransactionHistory,
	getAccountBalance,
};

export default authService;
