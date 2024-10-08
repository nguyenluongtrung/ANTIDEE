const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JobPost = require('./../models/jobPostModel');

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
		rating: {
			customerRating: {
				type: Number,
				default: 5.0,
			},
			domesticHelperRating: {
				type: Number,
				default: 5.0,
			},
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
		aPointHistory: [
			{
				apoint: {
					type: Number,
				},
				serviceId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Service',
				},
				update: {
					type: Date,
					default: Date.now,
				},
			},
		],
		accountBalance: {
			type: Number,
			default: 0,
		},
		invitationCode: {
			type: String,
		},
		usedInvitationCode: {
			type: String,
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
		receiveGiftHistory: {
			type: [
				{
					levelName: { type: String, required: true },
					isReceived: { type: Boolean, default: false },
				},
			],
			default: [
				{ levelName: 'Kiến con', isReceived: false },
				{ levelName: 'Kiến trưởng thành', isReceived: false },
				{ levelName: 'Kiến thợ', isReceived: false },
				{ levelName: 'Kiến chiến binh', isReceived: false },
				{ levelName: 'Kiến chúa', isReceived: false },
			],
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		hiddenPost: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ForumPost',
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

accountSchema.methods.calculateDomesticHelperRankingCriteria =
	async function () {
		const totalWorkingHours = await this.getTotalWorkingHours();
		return Number(
			totalWorkingHours +
				Number(this.rating.domesticHelperRating) * 5 +
				Number(((this.accountBalance * 5) / 1000000).toFixed(1))
		).toFixed(1);
	};

function isInCurrentMonthAndYear(dateString) {
	const currentDate = new Date();
	const givenDate = new Date(dateString);

	if (givenDate.getFullYear() !== currentDate.getFullYear()) {
		return false;
	}

	if (givenDate.getMonth() !== currentDate.getMonth()) {
		return false;
	}

	return true;
}

accountSchema.methods.getTotalWorkingHours = async function () {
	const jobPosts = await JobPost.find({
		domesticHelperId: this._id,
	});
	const filteredJobPosts = jobPosts.filter(
		(post) =>
			post.hasCompleted.customerConfirm == true &&
			post.hasCompleted.domesticHelperConfirm == true &&
			isInCurrentMonthAndYear(post.workingTime.startingDate)
	);
	let totalHours = 0;

	filteredJobPosts.forEach((job) => {
		job.workload.forEach((work) => {
			if (work.optionName === 'Thời gian')
				totalHours += Number(work.optionValue);
		});
	});

	return totalHours;
};

accountSchema.virtual('domesticHelperRankingCriteria').get(async function () {
	const result = await this.calculateDomesticHelperRankingCriteria();
	return result;
});

module.exports = mongoose.model('Account', accountSchema);
