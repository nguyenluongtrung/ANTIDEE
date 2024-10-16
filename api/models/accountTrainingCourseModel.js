const accountTrainingCoursesSchema = new Schema({
	accountId: {
		type: Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
	},
	trainingCourseId: {
		type: Schema.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	status: {
		type: String,
		enum: ['Completed', 'Learning'],
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

module.exports = mongoose.model(
	'AccountTrainingCourses',
	accountTrainingCoursesSchema
);
