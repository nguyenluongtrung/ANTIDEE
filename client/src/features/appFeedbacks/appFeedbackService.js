import axios from 'axios';

const API_URL = '/antidee/api/appFeedback/'
const getAllAppFeedbacks = async () =>{
    const response = await axios.get(API_URL);
    return response.data.data.appFeedbacks;
};

const createAppFeedback = async(appFeedbackData ) =>{
    const response = await axios.post(API_URL, appFeedbackData);
    return response.data.data.appFeedback;
};

const replyAppFeedback = async(replyData, appFeedbackId, token)=>{
    const config ={
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    const response = await axios.patch(API_URL +'reply/' + appFeedbackId, replyData, config);
    return response.data.data.appFeedback
}

const appFeedbackService ={
    getAllAppFeedbacks,
    createAppFeedback,
    replyAppFeedback,
};

export default appFeedbackService;