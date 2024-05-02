import axios from 'axios';

const API_URL = '/antidee/api/exams/';

const getAllExams = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	return response.data.data.exams;
};

const createExam = async (token, examData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, examData, config);
	return response.data.data.exam;
};

const updateExam = async (token, examData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(API_URL + `${id}`, examData, config);
	return response.data.data.updatedExam;
};

const deleteExam = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const examService = {
	getAllExams,
	createExam,
	updateExam,
	deleteExam,
};

export default examService;
