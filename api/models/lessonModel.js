const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    lesson_title: {
        type: String,
        required: true,
    },
    content: [
        {
            content_type: {
                type: String,
                enum: ['Exam', 'Video'],  
                required: true,
            },
            content_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true, 
            },
        }
    ],
    description: {
        type: String,
        required: true,
    },
    courseId: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    learning_progress: [
        {
            finished: {
                type: Boolean,
                required: true,
                default: false,
            },
            account_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Account',  
                required: true,
            },
        }
    ],
}, { timestamps: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
