const chatting = require('../models/chatModel');

//get All chat
const getAllChats = async (req, res) => {
    try {
        const chats = await chatting.find({})
            .populate('firstId secondId', 'avatar name role email');
        res.status(200).json({
            success: true,
            data: chats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

//createChat
const createChat = async (req, res) => {
    try {
        const { firstId, secondId } = req.body;

        // Kiểm tra xem đã có chat giữa hai ID này chưa
        const existingChat = await chatting.findOne({
            $or: [
                { firstId, secondId },
            ]
        });

        if (existingChat) {
            return res.status(400).json({
                success: false,
                message: "Đã có cuộc hội thoại giữa hai ID này",
                data: existingChat,
            });
        }

        // Tạo mới nếu chưa tồn tại
        const newChat = await chatting.create(req.body);
        res.status(201).json({
            success: true,
            data: newChat,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};


//find chat

const getChatById = async (req, res) => {
    try {
        const chat = await chatting.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy cuộc hội thoại",
            });
        }

        res.status(200).json({
            success: true,
            data: chat,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

module.exports = {
    getAllChats,
    createChat,
    getChatById,
}