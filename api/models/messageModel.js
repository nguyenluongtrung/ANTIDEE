const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Chat'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    text: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});



const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
