const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');
const Account = require('../models/accountModel');
const sendMail = require('../config/emailConfig');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);
	const accounts = await Account.find({});
	const { isUrgent } = req.body;

	if (isUrgent) {
		for (let account of accounts) {
			// check whether qualification is suitable
			if (account?.role === 'Người giúp việc')
				await sendMail({
					email: account.email,
					subject: 'CÔNG VIỆC CẦN NGƯỜI GẤP',
					html: `<div class="container">
					<h1>Kính gửi ${account.name}, </h1>
					<p>Hiện đang có một công việc cần người giúp việc gấp, và chúng tôi thấy rằng nó phù hợp với chứng chỉ hiện có của bạn.</p>
					<p>Hãy đăng nhập để nhận công việc ngay nhé!</p>
					<p>Trân trọng,</p>
					<p>Antidee Team</p>
				  </div>`,
				});
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
	const jobPosts = await JobPost.find({}).populate('serviceId');

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

module.exports = {
	updateJobPost,
	deleteJobPost,
	getJobPost,
	getAllJobPosts,
	createJobPost,
	getAJob,
};
