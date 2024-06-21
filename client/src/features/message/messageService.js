import axios from 'axios';

const API_URL_MESSAGE = '/antidee/api/message';

const createMessage = async (token, messageData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL_MESSAGE, messageData, config);

    return response.data.messages;
};

const getMessage = async (token, chatId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL_MESSAGE + "/" + chatId, config);
    return response.data.data.messages;
}

const getAllMessage = async () => {
    const response = await axios.get(API_URL_MESSAGE);
    return response.data.data.messages;
};

const messageService={
    createMessage,
    getMessage,
    getAllMessage,
}
export default messageService;