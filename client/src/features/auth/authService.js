import axios from 'axios';

const API_URL = '/antidee/api/accounts/';

const login = async (accountData) => {
	const response = await axios.post(API_URL + 'login', accountData);

	if (response.data) {
		localStorage.setItem('account', JSON.stringify(response.data));
	}

	return response.data.data.account;
};

const authService = {
	login,
};

export default authService;
