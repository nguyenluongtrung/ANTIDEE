import axios from 'axios';

const API_URL = '/antidee/api/domesticHelperFeedbacks/'
const getAllFeedbacks = async () =>{
    const response = await axios.get(API_URL);
    return response.data.data.feedbacks;
};

const createFeedback = async(token, feedbackData ) =>{
    const config ={
        headers:{
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, feedbackData, config);
    return response.data.data.feedback;
};

const replyFeedback = async(replyData, feedbackId, token)=>{
    const config ={
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.patch(API_URL +'reply/' + feedbackId, replyData, config);
    return response.data.data.feedback
}

const domesticHelperFeedbackService ={
    getAllFeedbacks,
    createFeedback,
    replyFeedback,
};

export default domesticHelperFeedbackService;