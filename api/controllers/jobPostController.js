const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');
const Account = require('../models/accountModel');
const AccountQualification = require('../models/accountQualificationModel');
const Service = require('../models/serviceModel');
const sendMail = require('../config/emailConfig');
const emailTemplate = require('../utils/sampleEmailForm');
const { addNewTransaction } = require('./transactionController');
const Transaction = require('./../models/transactionModel');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);
	const accounts = await Account.find({});
	const service = await Service.findById(jobPost.serviceId);
	const { isUrgent, isChosenYourFav } = req.body;
	const customer = accounts.find(
		(acc) => String(acc._id) == String(jobPost.customerId)
	);
	const qualifications = await AccountQualification.find({
		accountId: req.params.accountId,
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
				qualifications?.includes(service.requiredQualification) &&
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
				qualifications?.includes(service.requiredQualification) &&
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

const getJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.findById(req.params.jobPostId).populate(
		'serviceId'
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
	const accountId = req.params.accountId;
	const account = await Account.findById(accountId);

	const isFoundJobPost = await JobPost.findById(jobPostId);

	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const { receivedAt } = req.body;

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

	account.receivedJobList.push({
		jobPostId,
		receivedAt,
	});
	account.accountBalance =
		account.accountBalance - Math.round(0.3 * isFoundJobPost?.totalPrice);
	await account.save();
	await addNewTransaction(
		Math.round(0.3 * isFoundJobPost?.totalPrice),
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
	const { isCanceled, reason, account } = req.body;
	const jobPostId = req.params.jobPostId;

	const isFoundJobPost = await JobPost.findById(jobPostId);
	const foundAcc = await Account.findById(account);
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
				isCanceled,
				reason,
				account,
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
		isFoundJobPost?.domesticHelperId === null ||
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
	res.status(200).json({
		status: 'success',
		data: {
			jobPost: updatedJobPost,
			message: msg,
		},
	});
});

const cancelAJobDomesticHelper = asyncHandler(async (req, res) => {
	const { isCanceled, reason, account } = req.body;
	const jobPostId = req.params.jobPostId;

	const isFoundJobPost = await JobPost.findById(jobPostId);
	const foundAcc = await Account.findById(account);
	if (!isFoundJobPost) {
		res.status(404);
		throw new Error('Không tìm thấy bài đăng công việc');
	}

	const customerAcc = await Account.findById(isFoundJobPost.customerId);

	const updatedJobPost = await JobPost.findByIdAndUpdate(
		jobPostId,
		{
			cancelDetails: {
				isCanceled,
				reason,
				account,
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
            if (transaction.category === 'job_income' || transaction.category === 'commission_fee') {
                revenueByCurrentMonth += transaction.amount;
            } else if (transaction.category === 'refund' || transaction.category === 'salary') {
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
            $lt: new Date(currentYear + 1, 0, 1) 
        }
    });

    const jobIds = completedJobs.map((job) => job._id);

    const transactions = await Transaction.find({
        jobId: { $in: jobIds },
        date: { 
            $gte: new Date(currentYear, 0, 1), 
            $lt: new Date(currentYear + 1, 0, 1) 
        }
    });

    transactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const transactionMonth = transactionDate.getMonth();

        if (transaction.category === 'job_income' || transaction.category === 'commission_fee') {
            revenueByMonths[transactionMonth].revenue += transaction.amount;
        } else if (transaction.category === 'refund' || transaction.category === 'salary') {
            revenueByMonths[transactionMonth].revenue -= transaction.amount;
        }
    });

    let months = revenueByMonths.map(revenue => 'T' + revenue.month);
    let revenues = revenueByMonths.map(revenue => revenue.revenue);

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
};
