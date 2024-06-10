import axios from 'axios';

const API_URL = '/antidee/api/services/';

// Get all services
const getAllServices = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.services;
};

// Get service
const getService = async (token, serviceId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `/${serviceId}`, config);
	return response.data.data.service;
};

// Delete service
const deleteService = async (token, serviceId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `/${serviceId}`, config);
	return response.data.data.oldService;
};

// Create service
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
	console.log(response.data.data);
	return response.data.data.updatedService;
};

const serviceService = {
	getAllServices,
	deleteService,
	createService,
	updateService,
	getService,
};
export default serviceService;