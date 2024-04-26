const mongoose = require('mongoose');

const qualificationSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Qualification name is mandatory'],
		},
		description: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Qualification', qualificationSchema);
