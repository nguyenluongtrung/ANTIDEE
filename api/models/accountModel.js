const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const accountSchema = mongoose.Schema(
	{
		role: {
			type: String,
			enum: ['Khách hàng', 'Người giúp việc', 'Admin'],
			default: 'Khách hàng',
		},
		name: {
			type: String,
		},
		address: {
			type: String,
		},
		phoneNumber: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
		},
		dob: {
			type: Date,
		},
		gender: {
			type: String,
			enum: ['Nam', 'Nữ', 'Khác'],
			default: 'Nam',
		},
		avatar: {
			type: String,
			default: '',
		},
		accountLevel: {
			customerLevel: {
				name: {
					type: String,
					enum: ['Đồng', 'Bạc', 'Vàng', 'Kim cương'],
					default: 'Đồng',
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
					enum: [
						'Kiến con',
						'Kiến trưởng thành',
						'Kiến thợ',
						'Kiến chiến binh',
						'Kiến chúa',
					],
					default: 'Kiến con',
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
		examResults: [
			{
				examId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Exam',
				},
				totalScore: {
					type: Number,
				},
				duration: {
					type: Number,
				},
				isPassed: {
					type: Boolean,
				},
				takingDate: {
					type: Date,
				},
			},
		],
		resume: [
			{
				qualifications: [
					{
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Qualification',
					},
				],
				frontIdCard: {
					type: String,
				},
				backIdCard: {
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
		accountVouchers: [
			{
				voucherId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Voucher',
					required: true,
				},
				receivedAt: {
					type: Date,
					default: Date.now,
				},
				isUsed: {
					type: Boolean,
					default: false,
				},
			},
		],
		receivedJobList: [
			{
				jobPostId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'JobPost',
				},
				receivedAt: {
					type: Date,
				},
			},
		],
		blackList: [
			{
				domesticHelperId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Account',
				},
			},
		],
		favoriteList: [
			{
				domesticHelperId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Account',
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
