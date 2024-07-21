const MessageModel = require('../models/messageModel');
const { io } = require('../server'); // Make sure io is imported


//createMessage
const getAllMessage = async (req, res) => {
    const messages = await MessageModel.find({});

    res.status(200).json({
        status: "success",
        data: {
            messages,
        }
    })
}

const createMessage = async (req, res) => {
    try {
        const { chatId, senderId, text, files } = req.body;

        const messageData = {
            chatId,
            senderId,
            text,
            files
        };

        const messages = await MessageModel.create(messageData);

        if (chatId && io) {
            io.to(chatId).emit('receiveMessage', messages);

            // Emit notification for new message
            io.emit('notification', messages);
        }

        res.status(201).json({
            success: true,
            data: { messages },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
};


//getMessages
const getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await MessageModel.find({ chatId })
        res.status(200).json(messages)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
};



module.exports = {
    createMessage,
    getMessages,
    getAllMessage
}