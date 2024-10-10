const mongoose = require('mongoose');
const { Schema } = mongoose;

const lessonSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	content: [
		{
			contentType: {
				type: String,
				enum: ['Exam', 'Video'],
				required: true,
			},
			examId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Exam',
				required: function () {
					return this.contentType === 'Exam';
				},
			},
			videoId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Video',
				required: function () {
					return this.contentType === 'Video';
				},
			},
		},
	],
	description: {
		type: String,
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
	updatedDate: {
		type: Date,
		default: Date.now,
	},
});

const courseSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	duration: {
		type: Number,
		required: true,
	},
	qualificationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Qualification',
		required: true,
	},
	lessons: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Lesson',
			required: true,
		},
	],
	image: {
		type: String,
	},
	createdDate: {
		type: Date,
		default: Date.now,
	},
	updatedDate: {
		type: Date,
		default: Date.now,
	},
});

const Course = mongoose.model('Course', courseSchema);

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = {
	Course,
	Lesson,
};
