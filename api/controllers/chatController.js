const chatting = require('../models/chatModel');

//get All chat
const getAllChats = async (req, res) => {
    const chat = await chatting.find({}).populate({
        path: 'firstId secondId',
        select: 'avatar name'
    });;

    res.status(200).json({
        status: "success",
        data: {
            chat,
        },
    });
};

//createChat
const createChat = async (req, res) => {
    try {
        const { firstId, secondId } = req.body;

        // kiểm tra xem có chat nào tồn tại giữa 2 id hay không
        const existingChat = await chatting.findOne({
            $or: [
                { firstId, secondId },
                { firstId: secondId, secondId: firstId }
            ]
        });

        if (existingChat) {
            return res.status(400).json({
                success: false,
                error: "đã có chat tồn tại giữa 2 id này"
            });
        }
        //  tạo chat nếu không tồn tại

        const chat = await chatting.create(req.body);
        res.status(201).json({
            success: true,
            data: { chat },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        })
    }
}

//find chat

const getChatById = async (req, res) => {
    try {
        const chat = await chatting.findById(req.params.chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                error: "Chat not found"
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
}
module.exports = {
    getAllChats,
    createChat,
    getChatById,
}