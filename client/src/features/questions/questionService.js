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

const createQuestion = async (token, questionData) => {
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

const questionService = {
	getAllQuestions,
	createQuestion,
	updateQuestion,
};

export default questionService;
