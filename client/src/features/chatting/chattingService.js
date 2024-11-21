import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL_CHAT = '/antidee/api/chat';
const socket = io.connect('http://localhost:5173'); // Đảm bảo URL khớp với server của bạn

// Hàm để tạo chat mới
const createChat = async (token, chatData) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL_CHAT, chatData, config);
    return response.data.data.chat;
};

// Lấy chat theo ID
const getChatById = async (token, chatId) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL_CHAT}/${chatId}`, config);
    return response.data.data;
};

// Lấy tất cả các chat
const getAllChats = async () => {
    const response = await axios.get(API_URL_CHAT);
    return response.data.data;
};

// Hàm để gửi tin nhắn bằng socket
const createMessage = (messageData) => {
    socket.emit('sendMessage', messageData);
};

// Lắng nghe tin nhắn nhận được
const receiveMessage = (callback) => {
    socket.on('receiveMessage', (messageData) => {
        callback(messageData);
    });
};

// Tham gia vào phòng chat
const joinChat = (chatId) => {
    socket.emit('joinChat', chatId);
};

// Xuất các hàm
const chattingService = {
    getAllChats,
    createChat,
    getChatById,
    createMessage,
    receiveMessage,
    joinChat,
};

export default chattingService;
