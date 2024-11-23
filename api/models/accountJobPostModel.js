const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const accountJobPostsSchema = new Schema(
	{
		customerId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		jobPostId: {
			type: Schema.Types.ObjectId,
			ref: 'JobPost',
			required: true,
		},
		domesticHelperId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		receivedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('AccountJobPosts', accountJobPostsSchema);
