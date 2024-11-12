const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const accountServicesSchema = new Schema(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		serviceId: {
			type: Schema.Types.ObjectId,
			ref: 'Service',
			required: true,
		},
		rating: {
			type: Number,
		},
		ratingCount: {
			type: Number,
		},
		date: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('AccountService', accountServicesSchema);
