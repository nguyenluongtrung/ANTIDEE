import axios from 'axios';

const API_URL = '/antidee/api/topics/';  

const getAllTopics = async () => {
	const response = await axios.get(API_URL);
	return response.data.data.topics;
};
 
const createTopic = async (topicData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    const response = await axios.post(API_URL, topicData, config);
    return response.data;  
};

const topicService = {
    getAllTopics,
    createTopic,
};

export default topicService;
