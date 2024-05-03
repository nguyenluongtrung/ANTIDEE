import axios from 'axios';

const API_URL = '/antidee/api/services/';

const getAllServices = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	return response.data.data.services;
};

const serviceService = {
	getAllServices,
};

export default serviceService;
