const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountQualificationSchema = new Schema(
	{
		accountId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account',
		},
		qualificationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Qualification',
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model(
	'AccountQualification',
	accountQualificationSchema
);
