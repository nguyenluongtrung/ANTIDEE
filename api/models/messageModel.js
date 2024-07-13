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
        ref: 'Account'
    },
    text: {
        type: String,
    },
    files: [{
        type: String,
    }]
}, { 
    timestamps: true 
});

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
