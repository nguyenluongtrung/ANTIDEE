const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const accountExamsSchema = new Schema(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		examId: {
			type: Schema.Types.ObjectId,
			ref: 'Exam',
			required: true,
		},
		totalScore: {
			type: Number,
		},
		duration: {
			type: Number,
		},
		isPassed: {
			type: Boolean,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('AccountExam', accountExamsSchema);
