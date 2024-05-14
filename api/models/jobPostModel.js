const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		startingTime: {
			type: Date,
			default: Date.now(),
			required: true,
		},
		workingHours: {
			type: Number,
			required: true,
		},
		serviceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service',
		},
		status: {
			type: String,
			enum: ['', '', ''],
			default: '',
		},
		note: {
			type: String,
		},
		contactInfo: {
			address: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phoneNumber: {
				type: String,
				required: true,
			},
			fullName: {
				type: String,
				required: true,
			},
		},
		customerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		domesticHelperId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		paymentMethod: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('JobPost', jobPostSchema);
