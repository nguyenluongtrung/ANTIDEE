import axios from 'axios';

const API_URL = '/antidee/api/jobPosts/';

const getAllJobPosts = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);
	return response.data.data.jobPosts;
};

const createJobPost = async (token, jobPostData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, jobPostData, config);
	return response.data.data.jobPost;
};

const updateJobPost = async (token, jobPostData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(API_URL + `${id}`, jobPostData, config);
	return response.data.data.jobPost;
};

const deleteJobPost = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const jobPostService = {
	getAllJobPosts,
	createJobPost,
	deleteJobPost,
	updateJobPost,
};

export default jobPostService;
