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
            throw new Error("Unexpected response structure");
        }
    } catch (error) {
        console.error("Error fetching all forum posts:", error);
        throw error;
    }
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

        // Log toàn bộ phản hồi API để debug
        console.log("API Response:", response.data);

        // Kiểm tra lại cấu trúc của phản hồi
        if (response.data && response.data.status === 'success' && response.data.data) {
            // Kiểm tra nếu có ID của bài viết đã bị ẩn
            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                return response.data.data[0].id; // Trả về ID của bài viết đầu tiên
            } else if (response.data.data.id) {
                return response.data.data.id; // Trả về ID nếu tồn tại
            } else {
                throw new Error("Data structure does not contain post ID");
            }
        } else {
            throw new Error("Unexpected response structure");
        }
    } catch (error) {
        console.error("Error hiding forum post:", error.response?.data || error.message);
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

        // Log toàn bộ phản hồi API để debug
        console.log("API Response:", response.data);

        // Kiểm tra phản hồi có chứa data hay không
        if (response.data && response.data.status === 'success') {
            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                return response.data.data[0]; // Trả về bài viết đầu tiên trong mảng nếu có nhiều
            } else if (response.data.data && response.data.data._id) {
                return response.data.data; // Trả về bài viết đã được khôi phục
            } else {
                console.warn("Unhide action successful but no valid post data returned.");
                return { message: "Unhide successful, but no valid post data returned." };
            }
        } else {
            throw new Error("Unhide failed");
        }
    } catch (error) {
        console.error("Error un-hiding forum post:", error.message);
        throw error;
    }
};

export const commentForumPost = async(commentData, forumPostId, token)=>{
    const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

    const response = await axios.post(API_URL +'comment/'+forumPostId, commentData, config);
    return response.data.data.comments;

};

const reactLikesPost = async (forumPostId, accountId) => {
	const response = await axios.patch(
		API_URL + `/${forumPostId}/${accountId}`,
		{}
	);
	return response.data.data.forumPost;
};

const reactDislikesPost = async (forumPostId, accountId) => {
	const response = await axios.patch(
		API_URL + `/${forumPostId}/${accountId}`,
		{}
	);
	return response.data.data.forumPost;
};



const forumPostService = {
	getAllForumPosts,
	deleteForumPost,
	saveForumPost,
	getForumRepositories,
	createForumPost,
	hideForumPost,
    unhideForumPost,
    commentForumPost,
    reactLikesPost,
    reactDislikesPost,

};
export default forumPostService;
