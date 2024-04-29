import axios from 'axios';

const API_URL = '/antidee/api/accounts/';

const login = async (accountData) => {
	const response = await axios.post(API_URL + 'login', accountData);

	if (response.data) {
		localStorage.setItem('account', JSON.stringify(response.data));
	}

	return response.data.data.account;
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
	updateAccountInformation,
	getAccountInformation,
};

export default authService;
