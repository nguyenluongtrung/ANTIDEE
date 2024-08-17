import axios from "axios";  

const API_URL ='/antidee/api/forumPosts/'

const getAllForumPosts = async()=>{
    const response = await axios.get(API_URL);
    return response.data.data.forumPosts;
}

const deleteForumPost = async(token, forumPostId)=>{

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    const response = await axios.delete(`${API_URL}${forumPostId}`, config)
    return response.data.data.forumPostId;

};

// Create forumPost
const createForumPost = async (forumPostData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, forumPostData, config);
	console.log(response.data);
	return response.data.data.newForumPost;
};
// Update forumPost
const updateForumPost = async (token, forumPostData, forumPostId) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.patch(
		API_URL + `/${forumPostId}`,
		forumPostData,
		config
	);
	return response.data.data.updatedForumPost;
};
// Get forumPost
const getForumPost = async (forumPostId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + `/${forumPostId}`, config);
	return response.data.data.forumPost;
};
const forumPostService = {
    getAllForumPosts,
    deleteForumPost,
    createForumPost,
	updateForumPost,
    getForumPost,
}
export default forumPostService;