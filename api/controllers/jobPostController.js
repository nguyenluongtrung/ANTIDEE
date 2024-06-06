const asyncHandler = require('express-async-handler');
const JobPost = require('../models/jobPostModel');
const Account = require('../models/accountModel');
const Service = require('../models/serviceModel');
const sendMail = require('../config/emailConfig');

const createJobPost = asyncHandler(async (req, res) => {
	const jobPost = await JobPost.create(req.body);
	const accounts = await Account.find({});
	const service = await Service.findById(jobPost.serviceId);
	const { isUrgent } = req.body;

	if (isUrgent) {
		for (let account of accounts) {
			if (
				account?.resume[0]?.qualifications?.includes(
					service.requiredQualification
				) &&
				account?.role === 'Người giúp việc'
			)
				await sendMail({
					email: account.email,
					subject: 'CÔNG VIỆC MỚI ĐANG CHỜ BẠN',
					html: `
					<body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
						background-color: #F0F0F0;
						color: #000000; padding-bottom: 30px"
						bgcolor="#F0F0F0"
						text="#000000">
					
					<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0;"
						bgcolor="#F0F0F0">
					
					<table border="0" cellpadding="0" cellspacing="0" align="center"
						width="1000" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
						max-width: 1000px;" class="wrapper">
					
						<tr>
							<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
								padding-top: 20px;
								padding-bottom: 20px;">
							</td>
						</tr>
					
					</table>
					
					
					<table border="0" cellpadding="0" cellspacing="0" align="center"
						bgcolor="#FFFFFF"
						width="1000" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
						max-width: 1000px;" class="container">
					
						<tr>
							<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
								padding-top: 25px;
								color: #000000;
								font-family: sans-serif;" class="header">
									Công việc mới dành cho bạn
							</td>
						</tr>
					
						<tr>
							<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
								padding-top: 5px;
								color: #000000;
								font-family: sans-serif;" class="subheader">
							</td>
						</tr>
					
						<tr>
							<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
								padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
								href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
						src="https://storage.timviec365.vn/timviec365/pictures/images_08_2020/Cong-viec-danh-cho-nhung-tien-si-giay.jpg"
								alt="Please enable images to view this content" title="Hero Image"
								width="1000px" style="
								width: 100%;
								max-width: 1000px;
								color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
						</tr>
					
						<tr>
							<td valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
								padding-top: 25px; 
								color: #000000;
								font-family: sans-serif;" class="paragraph">
						<p>Chào <span style="font-style: italic">${account.name}</span>, </p>
										<p>Hiện đang có công việc <span style="font-weight: bold">${service?.name?.toUpperCase()}</span> cần người giúp việc gấp, và chúng tôi thấy rằng công việc này phù hợp với chứng chỉ của bạn.</p>
										<p>Hãy đăng nhập để nhận công việc ngay nhé!</p>
										<p>Trân trọng,</p>
										<p>Antidee Team</p>
							</td>
						</tr>
						<tr>
							<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
								padding-top: 25px;
								padding-bottom: 30px;" class="button"><a
								href="https://github.com/konsav/email-templates/" target="_blank" style="text-decoration:none">
									<table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="text-decoration:none; padding: 12px 24px; margin: 0; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
										bgcolor="#E9703E"><a target="_blank" style="
										color: #FFFFFF; font-family: sans-serif; margin-bottom: 30px; font-size: 17px; font-weight: 400; line-height: 120%;text-decoration:none"
										href='http://localhost:5173/'>
											Truy cập vào trang web
										</a>
								</td></tr></table></a>
							</td>
						</tr>
					</table>
					</td></tr></table>
					</body>
					`,
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
