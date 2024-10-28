import axios from 'axios';

const API_URL = '/antidee/api/questions/';

const getAllQuestions = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	return response.data.data.questions;
};

const getQuestion = async (token, questionId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + questionId, config);
	return response.data.data.question;
};

const createQuestions = async (token, questionData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, questionData, config);
	return response.data.data.question;
};

const updateQuestion = async (token, questionData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(API_URL + `${id}`, questionData, config);
	return response.data.data.updatedQuestion;
};

const deleteQuestion = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const questionService = {
	getAllQuestions,
	getQuestion,
	createQuestions,
	updateQuestion,
	deleteQuestion,
};

export default questionService;
