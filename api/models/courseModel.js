const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,  
        required: true,
    },
    qualificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Qualification',
    },
    account_ids: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account',  
        },
    ],
    lessons: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson',  
        },
    ],
    image:{
        type: String,
        required:true,
    }
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
