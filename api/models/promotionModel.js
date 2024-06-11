const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema({
	promotionValue: {
		type: Number,
		required: [true, 'Promotion value is mandatory'],
	},
	startDate: {
		type: Date,
		required: [true, 'Start date is mandatory'],
	},
	endDate: {
		type: Date,
		required: [true, 'End date is mandatory'],
	},
	promotionName: {
		type: String,
		required: [true, 'Promotion name is mandatory'],
	},
	promotionCode: {
		type: String,
		required: [true, 'Promotion code is mandatory'],
	},
	serviceIds: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Service'
			
		},
	],
	promotionQuantity: {
		type: Number,
		required: [true, 'Promotion quantity is mandatory'],
	},
	description:{
		type:String,
		
	},
	applicableCustomers:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
	]
});

module.exports = mongoose.model('Promotion', promotionSchema);
