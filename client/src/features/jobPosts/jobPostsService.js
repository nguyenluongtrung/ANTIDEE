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

const getAJob = async (token, jobPostId, accountId, receivedAt) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + '/get-a-job/' + `${jobPostId}/${accountId}`,
		{ receivedAt },
		config
	);
	return response.data.data.jobPost;
};

const applyAJob = async (token, jobPostId, accountId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + '/apply-a-job/' + `${jobPostId}/${accountId}`,
		{},
		config
	);
	return response.data.data.jobPost;
};

const selectATasker = async (token, jobPostId, taskerId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + '/select-a-job/' + `${jobPostId}/${taskerId}`,
		{},
		config
	);
	console.log(response.data.data);
	return response.data.data.jobPost;
};

const jobPostService = {
	getAllJobPosts,
	createJobPost,
	deleteJobPost,
	updateJobPost,
	getAJob,
	applyAJob,
	selectATasker,
};

export default jobPostService;
