import axios from 'axios';

const API_URL = '/antidee/api/qualifications/';

const getAllQualifications = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.qualifications;
};

const createQualification = async (token, qualificationData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, qualificationData, config);
	return response.data.data.qualification;
};

const updateQualification = async (token, qualificationData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `${id}`,
		qualificationData,
		config
	);
	return response.data.data.updatedQualification;
};

const deleteQualification = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const checkQualificationReceived = async (qualificationId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(
		API_URL + `receive/${qualificationId}`,
		config
	);
	return response.data.status;
};

const receiveNewQualification = async (qualificationId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.post(
		API_URL + `receive/${qualificationId}`,
		{},
		config
	);
	return response.data.status;
};

const getAccountQualifications = async (accountId) => {
	const response = await axios.get(
		API_URL + `get-account-qualifications/${accountId}`
	);
	return response.data.data.qualifications;
};

const qualificationService = {
	getAllQualifications,
	createQualification,
	updateQualification,
	deleteQualification,
	receiveNewQualification,
	checkQualificationReceived,
	getAccountQualifications,
};

export default qualificationService;
