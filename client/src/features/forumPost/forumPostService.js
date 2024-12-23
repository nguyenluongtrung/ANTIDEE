import axios from 'axios';

const API_URL = '/antidee/api/forumPosts/';

const getAllForumPosts = async (token) => {
	try {
		const response = await axios.get(API_URL, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (response.data && response.data.data) {
			return response.data.data.forumPosts;
		} else {
			throw new Error('Unexpected response structure');
		}
	} catch (error) {
		console.error('Error fetching all forum posts:', error);
		throw error;
	}
};

const getTopDiscussionForumPosts = async (token) => {
	try {
		const response = await axios.get(API_URL + 'top-discussions', {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (response.data) {
			return response.data;
		} else {
			throw new Error('Unexpected response structure');
		}
	} catch (error) {
		console.error('Error fetching all top discussions forum posts:', error);
		throw error;
	}
};

const getForumPost = async (token, forumPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(`${API_URL}${forumPostId}`, config);
	return response.data.data.forumPost;
};

const createForumPost = async (forumPostData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, forumPostData, config);
	return response.data.data.newForumPost;
};

const updateForumPost = async (token, forumPostData, forumPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `${forumPostId}`,
		forumPostData,
		config
	);
	return response.data.data;
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
	return response.data.data.repository;
};

const reactToForumPost = async (forumPostId, userId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `react/${forumPostId}`,
		{ userId },
		config
	);
	return response.data.data.forumPost;
};

const unReactToForumPost = async (forumPostId, userId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `un-react/${forumPostId}`,
		{ userId },
		config
	);
	return response.data.data.forumPost;
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

const getForumRepository = async (token, id) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const response = await axios.get(API_URL + `repository/${id}`, config);
	return response.data.data.repository;
};

const hideForumPost = async (forumPostId, token) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const response = await axios.patch(
			`${API_URL}/${forumPostId}/hide`,
			{},
			config
		);

		if (
			response.data &&
			response.data.status === 'success' &&
			response.data.data
		) {
			if (Array.isArray(response.data.data) && response.data.data.length > 0) {
				return response.data.data[0].id;
			} else if (response.data.data.id) {
				return response.data.data.id;
			} else {
				throw new Error('Data structure does not contain post ID');
			}
		} else {
			throw new Error('Unexpected response structure');
		}
	} catch (error) {
		throw error;
	}
};

export const unhideForumPost = async (forumPostId, token) => {
	try {
		const config = {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};

		const response = await axios.patch(
			`${API_URL}/${forumPostId}/unhide`,
			{},
			config
		);

		if (response.data && response.data.status === 'success') {
			if (Array.isArray(response.data.data) && response.data.data.length > 0) {
				return response.data.data[0];
			} else if (response.data.data && response.data.data._id) {
				return response.data.data;
			} else {
				console.warn(
					'Unhide action successful but no valid post data returned.'
				);
				return {
					message: 'Unhide successful, but no valid post data returned.',
				};
			}
		} else {
			throw new Error('Unhide failed');
		}
	} catch (error) {
		console.error('Error un-hiding forum post:', error.message);
		throw error;
	}
};

export const commentForumPost = async (commentData, forumPostId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(
		API_URL + 'comment/' + forumPostId,
		commentData,
		config
	);
	return response.data.data.comments;
};

export const updateHiddenDetails = async (
	reasonContent,
	status,
	postId,
	token
) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};
	const requestBody = {
		reasonContent,
		status,
	};

	const response = await axios.patch(
		API_URL + postId + '/hidden-details',
		requestBody,
		config
	);
	return response.data.data;
};

const forumPostService = {
	getAllForumPosts,
	getTopDiscussionForumPosts,
	deleteForumPost,
	saveForumPost,
	getForumRepositories,
	createForumPost,
	hideForumPost,
	unhideForumPost,
	commentForumPost,
	reactToForumPost,
	unReactToForumPost,
	updateHiddenDetails,
	getForumPost,
	updateForumPost,
	getForumRepository,
};
export default forumPostService;
