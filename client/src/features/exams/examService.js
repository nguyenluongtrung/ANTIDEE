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

const examService = {
	getAllExams,
};

export default examService;
