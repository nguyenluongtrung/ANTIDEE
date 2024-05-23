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

const getAccountInformation = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + 'information', config);
	return response.data.data.account;
};

const authService = {
	login,
	logout,
	register,
	getAllAccounts,
	updateAccountInformation,
	getAccountInformation,
};

export default authService;
