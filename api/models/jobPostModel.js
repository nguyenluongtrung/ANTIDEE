const mongoose = require('mongoose');

const jobPostSchema = mongoose.Schema(
	{
		workingTime: {
			startingHour: {
				type: String,
			},
			startingDate: {
				type: Date,
				default: Date.now(),
			},
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
		workload: [
			{
				optionName: {
					type: String,
				},
				optionValue: {
					type: String,
				},
			},
		],
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
		totalPrice: {
			type: Number,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('JobPost', jobPostSchema);
