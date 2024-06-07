const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');
const Account = require('../models/accountModel');
const Service = require('../models/serviceModel');
const sendMail = require('../config/emailConfig');
const emailTemplate = require('../utils/sampleEmailForm');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);
	const accounts = await Account.find({});
	const service = await Service.findById(jobPost.serviceId);
	const { isUrgent, isChosenYourFav } = req.body;
	const customer = accounts.find(
		(acc) => String(acc._id) == String(jobPost.customerId)
	);

	if (isUrgent) {
		for (let account of accounts) {
			if (
				account?.resume[0]?.qualifications?.includes(
					service.requiredQualification
				) &&
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
				account?.resume[0]?.qualifications?.includes(
					service.requiredQualification
				) &&
				account?.role === 'Người giúp việc' &&
				customer?.favoriteList?.findIndex(
					(tasker) => String(tasker.domesticHelperId) == String(account._id)
				) !== -1
			) {
				console.log(account);
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

	const account = await Account.findById(accountId);
	account.receivedJobList.push({
		jobPostId,
		receivedAt,
	});
	await account.save();

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

module.exports = {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	getAllJobPosts,
	createJobPost,
	getAJob,
	applyAJob,
	selectATasker,
};
