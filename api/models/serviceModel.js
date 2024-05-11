const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		
	},
	image: {
		type: String,
	},
	requiredQualification: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Qualification',
	},
	// price: {},
});

module.exports = mongoose.model('Service', serviceSchema);
