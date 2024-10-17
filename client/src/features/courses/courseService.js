import axios from 'axios';

const API_URL = '/antidee/api/course/';

const getAllCourse = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	console.log(response.data.data.courses);
	return response.data.data.courses;
};

const createCourse = async (token, courseData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, courseData, config);
	return response.data.data.course;
};

const deleteCourse = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const getLessonsByCourse = async (token, courseId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `${courseId}/lessons`, config);
	return response.data.data;
};

const courseService = {
	getAllCourse,
	createCourse,
	deleteCourse,
	getLessonsByCourse,
};

export default courseService;
