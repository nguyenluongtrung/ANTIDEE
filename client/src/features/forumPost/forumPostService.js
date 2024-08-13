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

const forumPostService = {
    getAllForumPosts,
    deleteForumPost,
    
}
export default forumPostService;