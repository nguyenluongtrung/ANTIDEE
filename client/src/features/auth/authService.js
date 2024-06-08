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

//black list
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

//favorite list
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

const updateRatingDomesticHelper = async(ratingData, domesticHelperId, token)=>{
	const config ={
		headers:{
			Authorization:`Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL+'rating/'+domesticHelperId,ratingData,config);
	return response.data.data.account;

}
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
	updateRatingDomesticHelper
};

export default authService;
