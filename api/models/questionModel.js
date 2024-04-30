const mongoose = require('mongoose');

const questionSchema = mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service',
		},
		choices: [
			{
				type: String,
				required: true,
			},
		],
		correctAnswer: {
			type: String,
			required: true,
		},
		explanation: {
			type: String,
			required: true,
		},
		difficultyLevel: {
			type: String,
			enum: ['Dễ', 'Bình thường', 'Khó'],
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Question', questionSchema);
