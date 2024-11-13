import axios from 'axios';

const API_URL = '/antidee/api/services/';

const getAllServices = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.services;
};

const getService = async (token, serviceId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `/${serviceId}`, config);
	return response.data.data.service;
};

const deleteService = async (token, serviceId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `/${serviceId}`, config);
	return response.data.data.oldService;
};

const createService = async (token, serviceData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, serviceData, config);
	return response.data.data.newService;
};

const updateService = async (token, updatedData, chosenServiceId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + chosenServiceId,
		updatedData,
		config
	);
	return response.data.data.updatedService;
};

const rankingServices = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `/ranking`, config);
	return response.data.data.rankingServices;
};

const ratingService = async (serviceId, rating, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(
		API_URL + `rating/${serviceId}`,
		{ rating },
		config
	);
	return response.data.status;
};

const recommend = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get('/antidee/api/recommendations', config);
	return response.data.data.result;
};

const serviceService = {
	getAllServices,
	deleteService,
	createService,
	updateService,
	getService,
	rankingServices,
	ratingService,
	recommend,
};
export default serviceService;
