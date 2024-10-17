const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const accountVideosSchema = new Schema(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			ref: 'Account',
			required: true,
		},
		videoId: {
			type: Schema.Types.ObjectId,
			ref: 'Video',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('AccountVideo', accountVideosSchema);
