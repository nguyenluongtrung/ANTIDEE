import axios from 'axios';

const API_URL = '/antidee/api/forumPosts/';

const getAllForumPosts = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.forumPosts;
};

const deleteForumPost = async (token, forumPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(`${API_URL}${forumPostId}`, config);
	return response.data.data.forumPostId;
};

const saveForumPost = async (token, chosenForumPostId, repositoryName) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(
		API_URL + `save-forum-post/${chosenForumPostId}`,
		{ repositoryName },
		config
	);
	console.log(response);
	return response.data.data.repository;
};

const getForumRepositories = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + 'repositories', config);
	return response.data.data.repositories;
};

const getForumPost = async (postId) => {
	const response = await axios.get(API_URL + postId);
	return response.data.data.forumPost;
};

const forumPostService = {
	getAllForumPosts,
	deleteForumPost,
	saveForumPost,
	getForumRepositories,
	getForumPost,
};
export default forumPostService;
