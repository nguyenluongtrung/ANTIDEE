import axios from 'axios';

const API_URL = '/antidee/api/videos/';

const getAllVideos = async (token) => {
	const response = await axios.get(API_URL);
	return response.data.data.videos;
};

const createVideo = async (token, videoData) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, videoData, config);
	return response.data.data.video;
};

const updateVideo = async (token, videoData, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(API_URL + `${id}`, videoData, config);
	return response.data.data.updatedVideo;
};

const deleteVideo = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + `${id}`, config);
	return response.data.data.id;
};

const finishVideoByAccount = async (accountId, videoId) => {
	const response = await axios.post(
		API_URL + 'finish/' + `${accountId}/${videoId}`
	);
	console.log(response);
	return response.data.message;
};

const videoService = {
	getAllVideos,
	createVideo,
	updateVideo,
	deleteVideo,
	finishVideoByAccount,
};

export default videoService;
