const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: [true, 'Name is name is mandatory'],
	},
	description: {
		type: String,
	},
	image: {
		type: String,
		required: true,
	},
	requiredQualification: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Qualification',
		required: true,
	},
	priceOptions: [
		{
			optionList: [
				{
					optionValue: {
						type: String,
					},
					optionIndex: {
						type: String,
					},
				},
			],
			optionName: {
				type: String,
			},
		},
	],
	priceFormula: {
		type: String,
	},
});

module.exports = mongoose.model('Service', serviceSchema);
