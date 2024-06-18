const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        domesticHelperId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }

    },
    {
        timestamps: true
    }
);

const chatModel = mongoose.model("Chat", chatSchema);
module.exports = chatModel;
