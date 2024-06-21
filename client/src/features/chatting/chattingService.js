import axios from 'axios';

const API_URL_CHAT = '/antidee/api/chat';

const createChat = async (token, chatData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL_CHAT, chatData, config);

    return response.data.chat;
};


const getChatById = async (token, chatId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL_CHAT + "/" + chatId, config);
    return response.data.data.chat;
}

const getAllChats = async () => {
    const response = await axios.get(API_URL_CHAT);
    return response.data.data.chat;
};
const chattingService = {
    getAllChats,
    createChat,
    getChatById,
};

export default chattingService;