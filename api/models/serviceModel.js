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
					optionName: {
						type: String,
					},
					optionValue: {
						type: Number,
					},
				},
			],
			price: {
				type: Number,
			},
		},
	],
});

module.exports = mongoose.model('Service', serviceSchema);
