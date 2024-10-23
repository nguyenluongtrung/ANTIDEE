const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: true,
        trim: true,
    } 
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
