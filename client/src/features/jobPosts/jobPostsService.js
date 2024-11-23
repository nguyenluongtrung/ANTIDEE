import axios from 'axios';

const API_URL = '/antidee/api/jobPosts/';

const getAllJobPosts = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.jobPosts;
};

const getJobPost = async (jobPostId) => {
	const response = await axios.get(API_URL + jobPostId);
	return response.data.data.jobPost;
};

const filterJobPostsByService = async (serviceIds, isInMyLocation, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL +
			`filter-jobs?serviceIds=${serviceIds}&isInMyLocation=${
				isInMyLocation ? true : false
			}`,
		config
	);
	return response.data.data.filteredJobPosts;
};

const getMyJobPostingHistory = async (option, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL + `job-posting-history?option=${option}`,
		config
	);
	return response.data.data.jobHistory;
};

const getMyReceivedJobs = async (option, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL + `my-jobs?option=${option}`,
		config
	);
	return response.data.data.myReceivedJobs;
};

const countNumberOfJobsByAccountId = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL + 'countNumberOfJobsByAccountId',
		config
	);
	return response.data.data;
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

const cancelJobPost = async (token, reason, jobPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'cancel-a-job/' + `${jobPostId}`,
		{
			reason,
		},
		config
	);
	return {
		jobPost: response.data.data.jobPost,
		msg: response.data.data.message,
	};
};

const cancelAJobDomesticHelper = async (token, reason, jobPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'cancel-a-job-domesticHelper/' + `${jobPostId}`,
		{
			reason,
		},
		config
	);
	return {
		jobPost: response.data.data.jobPost,
		msg: response.data.data.message,
	};
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

const getAJob = async (token, jobPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + 'get-a-job/' + `${jobPostId}`,
		{},
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
	console.log(jobPostId, taskerId);
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
	console.log(response.data);
	return response.data.data.jobPost;
};

const getRevenueByCurrentMonth = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(
		API_URL + '/get-revenue-by-current-month',
		config
	);
	return response.data.data.revenueByCurrentMonth;
};

const getRevenueByMonths = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + '/get-revenue-by-months', config);
	return response.data.data;
};

const jobPostService = {
	getAllJobPosts,
	filterJobPostsByService,
	createJobPost,
	deleteJobPost,
	updateJobPost,
	cancelJobPost,
	cancelAJobDomesticHelper,
	getAJob,
	applyAJob,
	selectATasker,
	countNumberOfJobsByAccountId,
	getRevenueByCurrentMonth,
	getRevenueByMonths,
	getJobPost,
	getMyJobPostingHistory,
	getMyReceivedJobs,
};

export default jobPostService;
