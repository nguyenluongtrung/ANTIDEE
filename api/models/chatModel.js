const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        firstId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        },
        secondId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',
            required: true
        }

    },
    {
        timestamps: true
    }
);

const chatModel = mongoose.model("Chat", chatSchema);
module.exports = chatModel;
