const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const accountSchema = mongoose.Schema(
	{
		role: {
			type: String,
			enum: ['customer', 'domestic_helper', 'admin'],
			default: 'customer',
		},
		name: {
			type: String,
		},
		address: {
			type: String,
		},
		phoneNumber: {
			type: String,
		},
		email: {
			type: String,
			required: [true, 'Account email is mandatory'],
			validate: [validator.isEmail, 'Please enter a valid email'],
		},
		dob: {
			type: Date,
		},
		gender: {
			type: String,
			enum: ['male', 'female', 'other'],
		},
		avatar: {
			type: String,
		},
		accountLevel: {
			customerLevel: {
				name: {
					type: String,
				},
				description: {
					type: String,
				},
				requirements: {
					type: String,
				},
				privilege: {
					type: String,
				},
			},
			domesticHelperLevel: {
				name: {
					type: String,
				},
				description: {
					type: String,
				},
				requirements: {
					type: String,
				},
				privilege: {
					type: String,
				},
			},
		},
		aPoints: {
			type: Number,
			default: 0,
		},
		accountBalance: {
			type: Number,
			default: 0,
		},
		password: {
			type: String,
			minLength: [8, 'Account password contains more than 8 characters'],
			select: false,
		},
		resume: [
			{
				qualifications: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Qualification',
					},
				],
				idCard: {
					type: String,
				},
				curriculumVitae: {
					type: String,
				},
				certificateOfResidence: {
					type: String,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

accountSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

accountSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
	return await bcrypt.compare(pswd, pswdDB);
};

module.exports = mongoose.model('Account', accountSchema);
