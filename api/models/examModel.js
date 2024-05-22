const mongoose = require('mongoose');

const examSchema = mongoose.Schema(
	{
		questions: {
			numOfQuestions: {
				type: Number,
				required: true,
			},
			easyQuestion: {
				numOfEasyQuestion: {
					type: Number,
					required: true,
				},
				easyQuestionList: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Question',
					},
				],
			},
			mediumQuestion: {
				numOfMediumQuestion: {
					type: Number,
					required: true,
				},
				mediumQuestionList: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Question',
					},
				],
			},
			hardQuestion: {
				numOfHardQuestion: {
					type: Number,
					required: true,
				},
				hardQuestionList: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Question',
					},
				],
			},
		},
		qualificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Qualification',
		},
		duration: {
			type: Number,
			required: true,
		},
		description: {
			type: String,
		},
		category: {
			type: String,
			enum: ['Kiểm tra đầu vào', 'Kiểm tra training'],
			required: true,
		},
		passGrade: {
			type: Number,
			required: true,
		},
		examResults: [
			{
				accountId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Account',
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
				takingDate: {
					type: Date,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Exam', examSchema);
