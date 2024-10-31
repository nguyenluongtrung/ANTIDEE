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

const getExam = async (token, examId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + examId, config);
	return response.data.data.exam;
};

const getMyExamResults = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + 'my-exam-results', config);

	return response.data.data.results;
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

const saveExamResult = async (token, updatedExamData, examId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'save-exam-result/' + `${examId}`,
		updatedExamData,
		config
	);
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
	getExam,
	createExam,
	updateExam,
	deleteExam,
	saveExamResult,
	getMyExamResults,
};

export default examService;
