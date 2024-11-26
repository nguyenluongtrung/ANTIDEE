const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');
const Account = require('../models/accountModel');
const AccountQualification = require('../models/accountQualificationModel');
const Service = require('../models/serviceModel');
const sendMail = require('../config/emailConfig');
const emailTemplate = require('../utils/sampleEmailForm');
const { addNewTransaction } = require('./transactionController');
const Transaction = require('./../models/transactionModel');
const AccountJobPost = require('./../models/accountJobPostModel');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);
	const accounts = await Account.find({});
	const service = await Service.findById(jobPost.serviceId);
	const { isUrgent, isChosenYourFav } = req.body;
	const customer = accounts.find(
		(acc) => String(acc._id) == String(jobPost.customerId)
	);
	const validAccountQualifications = await AccountQualification.find({
		qualificationId: String(service.requiredQualification),
	});

	if (jobPost.paymentMethod == 'Ví người dùng') {
		customer.accountBalance = Math.round(
			customer.accountBalance - jobPost.totalPrice
		);

		await addNewTransaction(
			jobPost.totalPrice,
			jobPost.customerId,
			`Thanh toán mua dịch vụ ${service.name}`,
			'job_income',
			jobPost._id,
			'',
			'Ví người dùng'
		);

		await customer.save();
	}

	if (isUrgent) {
		for (let account of accounts) {
			if (
				validAccountQualifications.find(
					(acc) => String(acc.accountId) == String(account._id)
				) &&
				account.isEligible &&
				account?.role === 'Người giúp việc'
			) {
				let email = {
					toEmail: account.email,
					subject: 'CÔNG VIỆC MỚI ĐANG CHỜ BẠN',
					header: 'Công việc mới dành cho bạn',
					imageUrl:
						'https://storage.timviec365.vn/timviec365/pictures/images_08_2020/Cong-viec-danh-cho-nhung-tien-si-giay.jpg',
					mainContent: `
						<p>Chào <span style="font-style: italic">${account.name}</span>, </p>
                        <p>Hiện đang có công việc <span style="font-weight: bold">${service?.name?.toUpperCase()}</span> cần người giúp việc gấp, và chúng tôi thấy rằng công việc này phù hợp với chứng chỉ của bạn.</p>
                        <p>Hãy đăng nhập để nhận công việc ngay nhé!</p>
                        <p>Trân trọng,</p>
                        <p>Antidee Team</p>
					`,
				};
				await sendMail(emailTemplate(email));
			}
		}
	}

	if (isChosenYourFav) {
		for (let account of accounts) {
			if (
				validAccountQualifications.find(
					(acc) => String(acc.accountId) == String(account._id)
				) &&
				account?.role === 'Người giúp việc' &&
				account.isEligible &&
				customer?.favoriteList?.findIndex(
					(tasker) => String(tasker.domesticHelperId) == String(account._id)
				) !== -1
			) {
				let email = {
					toEmail: account.email,
					subject: 'BẠN CÓ CÔNG VIỆC MỚI TỪ KHÁCH HÀNG CŨ',
					header: 'Công việc mới dành cho bạn',
					imageUrl:
						'https://media.baamboozle.com/uploads/images/914905/1667366395_512149.jpeg',
					mainContent: `
						<p>Chào <span style="font-style: italic">${account.name}</span>, </p>
                        <p>Hiện khách hàng cũ của bạn đang có công việc <span style="font-weight: bold">${service?.name?.toUpperCase()}</span> cần người giúp việc gấp, và chúng tôi thấy rằng công việc này phù hợp với chứng chỉ của bạn.</p>
                        <p>Hãy đăng nhập để nhận công việc ngay nhé!</p>
                        <p>Trân trọng,</p>
                        <p>Antidee Team</p>
					`,
				};
				await sendMail(emailTemplate(email));
			}
		}
	}

	res.status(201).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

const getAllJobPosts = asyncHandler(async (req, res) => {
	const jobPosts = await JobPost.find({})
		.sort([
			['isUrgent', 'desc'],
			['createdAt', 'desc'],
		])
		.populate('serviceId');

	res.status(200).json({
		status: 'success',
		data: {
			jobPosts,
		},
	});
});

const getMyJobPostingHistory = asyncHandler(async (req, res) => {
	const { option } = req.query;
	const jobPosts = await JobPost.find({ customerId: String(req.account._id) })
		.sort([
			['isUrgent', 'desc'],
			['createdAt', 'desc'],
		])
		.populate('serviceId');
	let jobHistory = [...jobPosts];
	if (option == 'hasNotDomesticHelperYet') {
		jobHistory = jobHistory.filter(
			(job) =>
				job.domesticHelperId == null && job?.cancelDetails?.isCanceled === false
		);
	} else if (option == 'hasAlreadyDomesticHelper') {
		jobHistory = jobHistory.filter(
			(job) =>
				job.domesticHelperId != null &&
				job?.hasCompleted?.customerConfirm == false &&
				job?.hasCompleted?.domesticHelperConfirm == false &&
				job?.cancelDetails?.isCanceled === false
		);
	} else if (option == 'completed') {
		jobHistory = jobHistory.filter(
			(job) =>
				job?.hasCompleted?.customerConfirm == true &&
				job?.hasCompleted?.domesticHelperConfirm == true &&
				job?.cancelDetails?.isCanceled === false
		);
	} else if (option == 'cancelled') {
		jobHistory = jobHistory.filter(
			(job) => job?.cancelDetails?.isCanceled === true
		);
	} else if (option == 'needToBeConfirmed') {
		jobHistory = jobHistory.filter(
			(job) =>
				job?.cancelDetails?.isCanceled === false &&
				job?.hasCompleted?.customerConfirm == false &&
				job?.hasCompleted?.domesticHelperConfirm == true
		);
	}

	res.status(200).json({
		status: 'success',
		data: {
			jobHistory,
		},
	});
});

const getMyReceivedJobs = asyncHandler(async (req, res) => {
	const { option } = req.query;
	const jobPosts = await JobPost.find({
		domesticHelperId: String(req.account._id),
	})
		.sort([['createdAt', 'desc']])
		.populate('serviceId');
	let myReceivedJobs = [...jobPosts];
	if (option == 'readyToWork') {
		myReceivedJobs = myReceivedJobs.filter(
			(job) =>
				job?.hasCompleted?.customerConfirm == false &&
				job?.hasCompleted?.domesticHelperConfirm == false &&
				job?.cancelDetails?.isCanceled == false
		);
	} else if (option == 'completed') {
		myReceivedJobs = myReceivedJobs.filter(
			(job) =>
				job?.hasCompleted?.customerConfirm == true &&
				job?.hasCompleted?.domesticHelperConfirm == true
		);
	}

	res.status(200).json({
		status: 'success',
		data: {
			myReceivedJobs,
		},
	});
});

const filterJobPostsByService = asyncHandler(async (req, res) => {
	const { serviceIds, isInMyLocation } = req.query;

	const jobPosts = await JobPost.find({})
		.populate('serviceId')
		.sort([
			['isUrgent', 'desc'],
			['createdAt', 'desc'],
		]);

	let filteredJobPosts = serviceIds
		? jobPosts.filter((jobPost) =>
				serviceIds
					.split(',')
					.some((id) => String(id) === String(jobPost.serviceId._id))
		  )
		: jobPosts;

	if (isInMyLocation) {
		const myCity = req.account?.address
			?.split(',')
			.at(-1)
			?.trim()
			.toUpperCase();

		filteredJobPosts = filteredJobPosts.filter((jobPost) => {
			const jobCity = jobPost?.contactInfo?.address
				?.split(',')
				.at(-1)
				?.trim()
				.toUpperCase();
			return jobCity && myCity && jobCity.includes(myCity);
		});
	}

	res.status(200).json({
		status: 'success',
		data: {
			filteredJobPosts,
		},
	});
});

const getJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.findById(req.params.jobPostId).populate(
		'serviceId domesticHelperId applicants'
	);

	if (!jobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	res.status(200).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

const deleteJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.findById(req.params.jobPostId);

	if (!jobPost) {
		res.status(404);
		throw new Error('Không tìm thấy câu hỏi');
	}

	await JobPost.findByIdAndDelete(req.params.jobPostId);

	res.status(200).json({
		status: 'success',
		data: {
			id: req.params.jobPostId,
		},
	});
});

const deleteAllJobPost = asyncHandler(async (req, res) => {
	await JobPost.deleteMany({});
	res.status(200).json({
		status: 'success',
	});
});

const updateJobPost = asyncHandler(async (req, res) => {
	const isFoundJobPost = await JobPost.findById(req.params.jobPostId);

	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const jobPost = await JobPost.findByIdAndUpdate(
		req.params.jobPostId,
		req.body,
		{ new: true }
	);

	if (
		jobPost.paymentMethod == 'Ví người dùng' &&
		jobPost.hasCompleted.customerConfirm &&
		jobPost.hasCompleted.domesticHelperConfirm
	) {
		const domesticHelper = await Account.findById(jobPost.domesticHelperId);
		domesticHelper.accountBalance = Math.round(
			domesticHelper.accountBalance + jobPost.totalPrice * 1
		);
		await addNewTransaction(
			Math.round(jobPost.totalPrice),
			jobPost.domesticHelperId,
			'Chuyển tiền hoàn thành công việc',
			'salary',
			jobPost._id,
			'',
			'Ví người dùng'
		);
		await domesticHelper.save();
	}

	res.status(200).json({
		status: 'success',
		data: {
			jobPost,
		},
	});
});

const getAJob = asyncHandler(async (req, res) => {
	const jobPostId = req.params.jobPostId;
	const accountId = req.account._id;
	const account = await Account.findById(accountId);

	const foundJobPost = await JobPost.findById(jobPostId).populate('serviceId');

	if (!foundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const qualifications = await AccountQualification.find({
		accountId,
	});

	const requiredQualification = foundJobPost.serviceId.requiredQualification;
	const isValidQualification = qualifications.find(
		(qualification) =>
			String(qualification.qualificationId) == String(requiredQualification)
	);

	if (!isValidQualification) {
		res.status(400);
		throw new Error('Bạn không có chứng chỉ phù hợp với công việc này!');
	}

	const receivedAt = new Date();

	const jobPost = await JobPost.findByIdAndUpdate(
		jobPostId,
		{
			domesticHelperId: accountId,
			receivedAt,
		},
		{
			new: true,
		}
	);

	await AccountJobPost.create({
		customerId: jobPost.customerId,
		domesticHelperId: jobPost.domesticHelperId,
		jobPostId,
		receivedAt,
	});
	account.accountBalance =
		account.accountBalance - Math.round(0.3 * foundJobPost?.totalPrice);
	await account.save();
	await addNewTransaction(
		Math.round(0.3 * foundJobPost?.totalPrice),
		account._id,
		'Lợi nhuận sau khi giúp việc nhận việc',
		'commission_fee',
		jobPostId,
		'',
		'Ví người dùng'
	);

	res.status(200).json({
		status: 'success',
		data: {
			jobPost,
			account,
		},
	});
});

const applyAJob = asyncHandler(async (req, res) => {
	const jobPostId = req.params.jobPostId;
	const accountId = req.params.accountId;

	const isFoundJobPost = await JobPost.findById(jobPostId);

	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	isFoundJobPost?.applicants?.push(accountId);
	await isFoundJobPost.save();

	res.status(200).json({
		status: 'success',
		data: {
			jobPost: isFoundJobPost,
		},
	});
});

const selectATasker = asyncHandler(async (req, res) => {
	const jobPostId = req.params.jobPostId;
	const taskerId = req.params.taskerId;

	const isFoundJobPost = await JobPost.findById(jobPostId);
	const tasker = await Account.findById(taskerId);

	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const updatedJobPost = await JobPost.findByIdAndUpdate(
		jobPostId,
		{
			domesticHelperId: taskerId,
		},
		{ new: true }
	);

	tasker?.receivedJobList?.push({
		jobPostId,
		receivedAt: new Date(),
	});

	await tasker.save();

	res.status(200).json({
		status: 'success',
		data: {
			jobPost: updatedJobPost,
		},
	});
});

const cancelAJob = asyncHandler(async (req, res) => {
	const { reason } = req.body;
	const jobPostId = req.params.jobPostId;

	const isFoundJobPost = await JobPost.findById(jobPostId);
	const foundAcc = await Account.findById(req.account._id);
	const domesticHelperAcc = await Account.findById(
		isFoundJobPost.domesticHelperId
	);
	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const updatedJobPost = await JobPost.findByIdAndUpdate(
		jobPostId,
		{
			cancelDetails: {
				isCanceled: true,
				reason,
				account: req.account._id,
			},
		},
		{ new: true }
	);

	const startingDate = new Date(isFoundJobPost.workingTime.startingDate);
	startingDate.setMinutes(
		startingDate.getMinutes() - startingDate.getTimezoneOffset()
	);
	const startingHour = parseInt(
		isFoundJobPost.workingTime.startingHour.split(':')[0]
	);
	const startingMinute = parseInt(
		isFoundJobPost.workingTime.startingHour.split(':')[1]
	);

	const startingTime = `${startingHour
		.toString()
		.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

	let msg;

	if (
		!isFoundJobPost?.domesticHelperId ||
		startingDate.toDateString() > new Date().toDateString() ||
		(startingDate.toDateString() == new Date().toDateString() &&
			startingTime >= getCurrentTimeStringPlus1Hour())
	) {
		msg =
			'Bạn đã hủy việc thành công. Bạn sẽ nhận lại 100% giá trị công việc đã hủy';
		if (isFoundJobPost.paymentMethod == 'Ví người dùng') {
			foundAcc.accountBalance =
				foundAcc.accountBalance + Math.round(1 * isFoundJobPost?.totalPrice);
			await foundAcc.save();
			await addNewTransaction(
				Math.round(1 * isFoundJobPost?.totalPrice),
				foundAcc._id,
				'Chuyển tiền hủy việc',
				'refund',
				jobPostId,
				'',
				'Ví người dùng'
			);
		}
	} else {
		if (isFoundJobPost.paymentMethod == 'Ví người dùng') {
			msg =
				'Bạn đã hủy việc thành công và sẽ nhận lại 70% giá trị công việc đã hủy và giảm điểm uy tín';
			foundAcc.accountBalance =
				foundAcc.accountBalance + Math.round(0.7 * isFoundJobPost?.totalPrice);
			foundAcc.rating.customerRating =
				Math.round(foundAcc.rating.customerRating) - 0.1;
			await foundAcc.save();
			await addNewTransaction(
				Math.round(0.7 * isFoundJobPost?.totalPrice),
				foundAcc._id,
				'Chuyển tiền hủy việc - phạt 30% giá trị công việc',
				'refund',
				jobPostId,
				'',
				'Ví người dùng'
			);
		}
	}
	if (domesticHelperAcc) {
		domesticHelperAcc.accountBalance =
			domesticHelperAcc.accountBalance +
			Math.round(0.3 * isFoundJobPost?.totalPrice);
		await domesticHelperAcc.save();
		await addNewTransaction(
			Math.round(0.3 * isFoundJobPost?.totalPrice),
			domesticHelperAcc._id,
			'Chuyển tiền bồi thường hủy việc cho giúp việc',
			'refund',
			jobPostId,
			'',
			'Ví người dùng'
		);
	}

	res.status(200).json({
		status: 'success',
		data: {
			jobPost: updatedJobPost,
			message: msg,
		},
	});
});

const cancelAJobDomesticHelper = asyncHandler(async (req, res) => {
	const { reason } = req.body;
	const jobPostId = req.params.jobPostId;

	const isFoundJobPost = await JobPost.findById(jobPostId);
	const foundAcc = await Account.findById(req.account._id);
	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const customerAcc = await Account.findById(isFoundJobPost.customerId);

	const updatedJobPost = await JobPost.findByIdAndUpdate(
		jobPostId,
		{
			cancelDetails: {
				isCanceled: true,
				reason,
				account: req.account._id,
			},
		},
		{ new: true }
	);

	let msg;

	msg =
		'Bạn đã hủy việc thành công và mất tiền cọc đồng thời bị giảm điểm uy tín';

	foundAcc.rating.domesticHelperRating =
		foundAcc.rating.domesticHelperRating - 0.1;

	if (isFoundJobPost.paymentMethod == 'Ví người dùng') {
		customerAcc.accountBalance =
			customerAcc.accountBalance + Math.round(1 * isFoundJobPost?.totalPrice);
		await addNewTransaction(
			Math.round(1 * isFoundJobPost?.totalPrice),
			customerAcc._id,
			'Tiền bồi thường vì người giúp việc hủy công việc',
			'refund',
			jobPostId,
			'',
			'Ví người dùng'
		);
	}

	await foundAcc.save();
	await customerAcc.save();

	res.status(200).json({
		status: 'success',
		data: {
			jobPost: updatedJobPost,
			message: msg,
		},
	});
});

const getCurrentTimeStringPlus1Hour = () => {
	const now = new Date();
	let currentHour = now.getHours() + 1;
	const currentMinute = now.getMinutes();

	if (currentHour >= 24) {
		currentHour -= 24;
	}

	return `${currentHour.toString().padStart(2, '0')}:${currentMinute
		.toString()
		.padStart(2, '0')}`;
};

const countNumberOfJobPostByAccountId = asyncHandler(async (req, res) => {
	const jobPostsGroupedByAccountId = await JobPost.aggregate([
		{
			$group: {
				_id: '$customerId',
				totalJobPosts: { $count: {} },
			},
		},
		{
			$lookup: {
				from: 'accounts',
				localField: '_id',
				foreignField: '_id',
				as: 'account',
			},
		},
		{
			$unwind: '$account',
		},
		{
			$project: {
				accountId: '$account._id',
				accountName: '$account.name',
				totalJobPosts: 1,
			},
		},
	]);

	res.status(200).json({
		success: true,
		data: jobPostsGroupedByAccountId,
	});
});

const getRevenueByCurrentMonth = asyncHandler(async (req, res) => {
	const currentMonth = new Date().getMonth();

	const completedJobs = await JobPost.find({
		'hasCompleted.customerConfirm': true,
		'hasCompleted.domesticHelperConfirm': true,
	});

	const jobIds = completedJobs.map((job) => job._id);

	const transactions = await Transaction.find({
		jobId: { $in: jobIds },
	});

	let revenueByCurrentMonth = 0;

	transactions.forEach((transaction) => {
		const transactionMonth = new Date(transaction.date).getMonth();
		if (transactionMonth === currentMonth) {
			if (
				transaction.category === 'job_income' ||
				transaction.category === 'commission_fee'
			) {
				revenueByCurrentMonth += transaction.amount;
			} else if (
				transaction.category === 'refund' ||
				transaction.category === 'salary'
			) {
				revenueByCurrentMonth -= transaction.amount;
			}
		}
	});

	res.status(200).json({
		success: true,
		data: {
			revenueByCurrentMonth,
		},
	});
});

const getRevenueByMonths = asyncHandler(async (req, res) => {
	const currentYear = new Date().getFullYear();

	let revenueByMonths = Array.from({ length: 12 }, (_, index) => ({
		month: index + 1,
		revenue: 0,
	}));

	const completedJobs = await JobPost.find({
		'hasCompleted.customerConfirm': true,
		'hasCompleted.domesticHelperConfirm': true,
		'hasCompleted.completedAt': {
			$gte: new Date(currentYear, 0, 1),
			$lt: new Date(currentYear + 1, 0, 1),
		},
	});

	const jobIds = completedJobs.map((job) => job._id);

	const transactions = await Transaction.find({
		jobId: { $in: jobIds },
		date: {
			$gte: new Date(currentYear, 0, 1),
			$lt: new Date(currentYear + 1, 0, 1),
		},
	});

	transactions.forEach((transaction) => {
		const transactionDate = new Date(transaction.date);
		const transactionMonth = transactionDate.getMonth();

		if (
			transaction.category === 'job_income' ||
			transaction.category === 'commission_fee'
		) {
			revenueByMonths[transactionMonth].revenue += transaction.amount;
		} else if (
			transaction.category === 'refund' ||
			transaction.category === 'salary'
		) {
			revenueByMonths[transactionMonth].revenue -= transaction.amount;
		}
	});

	let months = revenueByMonths.map((revenue) => 'T' + revenue.month);
	let revenues = revenueByMonths.map((revenue) => revenue.revenue);

	res.status(200).json({
		success: true,
		data: {
			months,
			revenues,
		},
	});
});

module.exports = {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	getAllJobPosts,
	createJobPost,
	getAJob,
	applyAJob,
	selectATasker,
	deleteAllJobPost,
	cancelAJob,
	cancelAJobDomesticHelper,
	countNumberOfJobPostByAccountId,
	getRevenueByCurrentMonth,
	getRevenueByMonths,
	filterJobPostsByService,
	getMyJobPostingHistory,
	getMyReceivedJobs,
};
