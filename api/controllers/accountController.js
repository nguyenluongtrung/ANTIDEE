const asyncHandler = require('express-async-handler');
const Account = require('./../models/accountModel');
const Service = require('./../models/serviceModel');
const DomesticHelperFeedback = require('./../models/domesticHelper_FeedbackModel');
const JobPost = require('./../models/jobPostModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendMail = require('../config/emailConfig');
const emailTemplate = require('../utils/sampleEmailForm');
const { populate } = require('dotenv');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET_STR, {
		expiresIn: '30d',
	});
};

const login = asyncHandler(async (req, res) => {
	const { phoneNumber, password } = req.body;

	const account = await Account.findOne({ phoneNumber }).select('+password');

	if (
		account &&
		(await account.comparePasswordInDb(password, account.password))
	) {
		res.status(200).json({
			status: 'success',
			data: {
				account,
				token: generateToken(account._id),
			},
		});
	} else {
		res.status(400);
		throw new Error('Số điện thoại hoặc mật khẩu không đúng');
	}
});

const register = asyncHandler(async (req, res) => {
	const { phoneNumber } = req.body;

	const accountExistsByPhoneNumber = await Account.findOne({ phoneNumber });

	if (accountExistsByPhoneNumber) {
		res.status(400);
		throw new Error('Số điện thoại đã tồn tại');
	}

	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let invitationCode = '';

	while (true) {
		let code = '';
		for (let i = 0; i < 10; i++) {
			code += characters[crypto.randomInt(0, characters.length)];
		}

		const account = await Account.find({ invitationCode: code });

		if (account.length == 0) {
			invitationCode = code;
			break;
		}
	}

	const account = await Account.create({ ...req.body, invitationCode });

	if (account) {
		res.status(201).json({
			status: 'success',
			data: {
				account,
			},
		});
	} else {
		res.status(400);
		throw new Error('Tài khoản không hợp lệ');
	}
});

const getAllAccounts = asyncHandler(async (req, res) => {
	const accounts = await Account.find({}).populate('resume.qualifications');

	res.status(200).json({
		status: 'success',
		data: {
			accounts,
		},
	});
});

const updateAccountInformation = asyncHandler(async (req, res) => {
	const { email, phoneNumber } = req.body;

	const accountExistsByEmail = await Account.findOne({ email });

	if (email !== req.account.email && accountExistsByEmail) {
		res.status(400);
		throw new Error('Email đã tồn tại');
	}

	const accountExistsByPhoneNumber = await Account.findOne({ phoneNumber });

	if (phoneNumber !== req.account.phoneNumber && accountExistsByPhoneNumber) {
		res.status(400);
		throw new Error('Số điện thoại đã tồn tại');
	}

	const updatedAccount = await Account.findByIdAndUpdate(
		req.account._id,
		req.body,
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedAccount,
		},
	});
});

const updateAccountForgottenPassword = asyncHandler(async (req, res) => {
	const accountId = req.params.accountId;

	let { password } = req.body;

	password = await bcrypt.hash(password, 12);

	const updatedAccount = await Account.findByIdAndUpdate(
		accountId,
		{ password },
		{
			new: true,
		}
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedAccount,
		},
	});
});

const blockAccount = asyncHandler(async (req, res) => {
	const accountId = req.params.accountId;
	const account = await Account.findById(accountId);

	const updatedAccount = await Account.findByIdAndUpdate(
		accountId,
		{ isBlocked: !account.isBlocked },
		{
			new: true,
		}
	);

	if (updatedAccount.isBlocked) {
		let email = {
			toEmail: account.email,
			subject: 'TÀI KHOẢN CỦA BẠN ĐÃ BỊ KHOÁ',
			header: 'Kiểm tra tài khoản đã bị khoá !!!!',
			imageUrl: 'https://cdn-icons-png.flaticon.com/256/890/890132.png',
			mainContent: `
				<p>Kính gửi quý khách <span style="font-style: italic">${account.name}</span>, </p>
				<p>Chúng tôi rất tiếc thông báo rằng tài khoản của Quý khách đã bị khoá!!!</p>
				<p>Nếu Quý khách gặp bất kỳ khó khăn nào trong quá trình đăng nhập hoặc có bất kỳ câu hỏi nào về vấn đề tài khoản, xin vui lòng liên hệ với chúng tôi qua email [antideeteam@gmail.com] hoặc số điện thoại [1800 0000], để được tư vấn và giải quyết vấn đề.</p>
				<p>Chúng tôi rất mong nhận được sự hợp tác từ Quý khách và hy vọng rằng dịch vụ của chúng tôi sẽ mang lại sự hài lòng cho Quý khách.</p>
				<p>Trân trọng,</p>
				<p>Antidee Team</p>
			`,
		};
		await sendMail(emailTemplate(email));
	} else {
		let email = {
			toEmail: account.email,
			subject: 'TÀI KHOẢN CỦA BẠN ĐÃ ĐƯỢC MỞ KHOÁ THÀNH CÔNG',
			header: 'Kiểm tra tài khoản đã được mở khoá !!!!',
			imageUrl: 'https://cdn-icons-png.flaticon.com/512/891/891386.png',
			mainContent: `
				<p>Kính gửi quý khách <span style="font-style: italic">${account.name}</span>, </p>
				<p>Chúng tôi rất vui mừng thông báo rằng tài khoản của Quý khách đã được mở thành công.</p>
				<p>Nếu Quý khách gặp bất kỳ khó khăn nào trong quá trình đăng nhập hoặc có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi qua email [antideeteam@gmail.com] hoặc số điện thoại [1800 0000].</p>
				<p>Chúng tôi rất mong nhận được sự hợp tác từ Quý khách và hy vọng rằng dịch vụ của chúng tôi sẽ mang lại sự hài lòng cho Quý khách.</p>
				<p>Trân trọng,</p>
				<p>Antidee Team</p>
			`,
		};
		await sendMail(emailTemplate(email));
	}

	res.status(200).json({
		status: 'success',
		data: {
			updatedAccount,
		},
	});
});

const getAccountForgottenPassword = asyncHandler(async (req, res) => {
	const account = await Account.find({ phoneNumber: req.params.phoneNumber });

	res.status(200).json({
		status: 'success',
		data: {
			singleAccount: account[0],
		},
	});
});

const getAccountInformation = asyncHandler(async (req, res) => {
	const account = await Account.findById(req.account._id)
		.populate('blackList.domesticHelperId')
		.populate('favoriteList.domesticHelperId')
		.populate({
			path: 'aPointHistory',
			populate: {
				path: 'serviceId',
			},
		});

	if (!account) {
		res.status(404);
		throw new Error('Account not found');
	}
	res.status(200).json({
		status: 'success',
		data: {
			account,
		},
	});
});

//Black list
const addDomesticHelperToBlackList = asyncHandler(async (req, res) => {
	const accountId = req.account._id;
	const { domesticHelperId } = req.params;

	if (accountId.toString() === domesticHelperId.toString()) {
		res.status(400);
		throw new Error('Không thể thêm chính mình vào danh sách hạn chế !!!');
	}

	const account = await Account.findById(accountId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found');
	}
	const isAlreadyInFavoriteList = account.favoriteList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);

	if (isAlreadyInFavoriteList) {
		res.status(400);
		throw new Error('Người này đã có trong danh sách yêu thích của bạn !!!');
	}

	const isAlreadyInBlackList = account.blackList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);

	if (isAlreadyInBlackList) {
		res.status(400);
		throw new Error('Người này đã có trong danh sách đen của bạn !!!');
	}

	account.blackList.push({ domesticHelperId });

	await account.save();

	res.status(201).json({
		status: 'success',
		data: {
			account,
		},
	});
});

const deleteDomesticHelperFromBlackList = asyncHandler(async (req, res) => {
	const accountId = req.account._id;
	const { domesticHelperId } = req.params;

	const account = await Account.findById(accountId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found');
	}

	const isInBlackList = account.blackList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);

	if (!isInBlackList) {
		res.status(400);
		throw new Error(
			'Người này không có trong danh sách yêu hạn chế của bạn !!!'
		);
	}

	account.blackList = account.blackList.filter(
		(item) => item.domesticHelperId.toString() !== domesticHelperId
	);

	await account.save();

	res.status(200).json({
		status: 'success',
		data: {
			account,
		},
	});
});

const addDomesticHelperToFavoriteList = asyncHandler(async (req, res) => {
	const accountId = req.account._id;
	const { domesticHelperId } = req.params;

	if (accountId.toString() === domesticHelperId.toString()) {
		res.status(400);
		throw new Error('Không thể thêm chính mình vào danh sách yêu thích !!!');
	}

	const account = await Account.findById(accountId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found');
	}
	const isAlreadyInBlackList = account.blackList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);

	if (isAlreadyInBlackList) {
		res.status(400);
		throw new Error('Người này đã có trong danh sách đen của bạn !!!');
	}

	const isAlreadyInFavoriteList = account.favoriteList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);
	if (isAlreadyInFavoriteList) {
		res.status(400);
		throw new Error('Người này đã có trong danh sách yêu thích của bạn !!!');
	}

	account.favoriteList.push({ domesticHelperId });

	await account.save();

	res.status(201).json({
		status: 'success',
		data: {
			account,
		},
	});
});

const deleteDomesticHelperFromFavoriteList = asyncHandler(async (req, res) => {
	const accountId = req.account._id;
	const { domesticHelperId } = req.params;

	const account = await Account.findById(accountId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found');
	}

	const isInFavoriteList = account.favoriteList.some(
		(item) => item.domesticHelperId.toString() === domesticHelperId
	);

	if (!isInFavoriteList) {
		res.status(400);
		throw new Error('Người này không có trong danh sách yêu thích của bạn !!!');
	}

	account.favoriteList = account.favoriteList.filter(
		(item) => item.domesticHelperId.toString() !== domesticHelperId
	);

	await account.save();

	res.status(200).json({
		status: 'success',
		data: {
			account,
		},
	});
});

const inviteFriend = asyncHandler(async (req, res) => {
	const { invitedEmail, invitationCode, accountName } = req.body;
	let email = {
		toEmail: invitedEmail,
		subject: 'BẠN CÓ MỘT LỜI MỜI TỪ BẠN BÈ CỦA BẠN',
		header: 'Bạn có một lời mời từ bạn bè của bạn',
		imageUrl:
			'https://www.southernliving.com/thmb/TeMx3qVnoeeuz2APi6wjqNet7GI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/gettyimages-961454128-21d12047e4c24ddbabdb99607d904923.jpg',
		mainContent: `
			<p>Chào bạn, </p>
			<p>Bạn thật may mắn khi nhận được lời giới thiệu từ bạn <span style="font-weight: bold">${accountName.toUpperCase()}</span>.</p>
			<p>Mã giới thiệu: <span style="color: red">${invitationCode}</span></p>
			<p>Hãy đăng ký và sử dụng dịch vụ đầu tiên để nhận được ưu đãi giảm 10,000 đồng bạn nhé!</p>
			<p>Trân trọng,</p>
			<p>Antidee Team</p>
		`,
	};
	await sendMail(emailTemplate(email));
	res.status(200).json({
		status: 'success',
	});
});

const checkInvitationCode = asyncHandler(async (req, res) => {
	const invitationCode = req.params.invitationCode;
	const account = await Account.findOne({ invitationCode });
	const jobPosts = await JobPost.find({ customerId: req.account._id });
	if (!account) {
		res.status(404);
		throw new Error('Mã mời không tồn tại!');
	} else if (String(account._id) === String(req.account._id)) {
		res.status(400);
		throw new Error('Mã mời không hợp lệ!');
	} else if (jobPosts.length > 0) {
		res.status(400);
		throw new Error('Tài khoản đã mua dịch vụ!');
	} else {
		res.status(200).json({
			status: 'success',
			data: {
				accountId: account._id,
			},
		});
	}
});

const loadMoneyAfterUsingInvitationCode = asyncHandler(async (req, res) => {
	const myAccount = await Account.findById(req.account._id);
	myAccount.accountBalance = myAccount.accountBalance + 10000;
	await myAccount.save();

	const ownerAccount = await Account.findById(req.params.ownerId);
	ownerAccount.accountBalance = ownerAccount.accountBalance + 10000;
	await ownerAccount.save();
	res.status(200).json({
		status: 'success',
	});
});

const updateRatingDomesticHelper = asyncHandler(async (req, res) => {
	const { domesticHelperId } = req.params;
	const { rating } = req.body;

	const account = await Account.findById(domesticHelperId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found!');
	}

	const feedbacks = await DomesticHelperFeedback.find({ domesticHelperId });
	const numberOfRatings = feedbacks.length;

	if (numberOfRatings === 0) {
		account.rating.domesticHelperRating = rating;
	} else {
		const totalRating = feedbacks.reduce(
			(sum, feedback) => sum + feedback.rating,
			0
		);
		account.rating.domesticHelperRating = (
			totalRating / numberOfRatings
		).toFixed(1);
	}

	await account.save();

	res.status(200).json({
		status: 'success',
		data: {
			account,
		},
	});
});

const getDomesticHelpersRanking = asyncHandler(async (req, res) => {
	const accounts = await Account.find({ role: 'Người giúp việc' }).lean();

	const accountsWithRankingCriteria = await Promise.all(
		accounts.map(async (account) => {
			const accountModel = await Account.findById(account._id);
			const totalWorkingHours = await accountModel.getTotalWorkingHours();
			const domesticHelperRankingCriteria =
				await accountModel.calculateDomesticHelperRankingCriteria();
			return { ...account, domesticHelperRankingCriteria, totalWorkingHours };
		})
	);

	accountsWithRankingCriteria.sort((a, b) => {
		return b.domesticHelperRankingCriteria - a.domesticHelperRankingCriteria;
	});

	res.status(200).json({
		status: 'success',
		data: { accountsWithRankingCriteria },
	});
});

const getDomesticHelpersTotalWorkingHours = asyncHandler(async (req, res) => {
	const { domesticHelperId } = req.params;
	const myAccount = await Account.findById(domesticHelperId);

	const totalHours = await myAccount.getTotalWorkingHours();

	res.status(200).json({
		status: 'success',
		data: totalHours,
	});
});

const updateDomesticHelperLevel = asyncHandler(async (req, res) => {
	const account = await Account.findById(req.params.domesticHelperId);

	const journey = [
		{ level: 'Kiến con', requiredHours: 1 },
		{ level: 'Kiến trưởng thành', requiredHours: 2 },
		{ level: 'Kiến thợ', requiredHours: 3 },
		{ level: 'Kiến chiến binh', requiredHours: 4 },
		{ level: 'Kiến chúa', requiredHours: 5 },
	];

	const currentLevelIndex = journey.findIndex(
		(level) => level.level === account.accountLevel.domesticHelperLevel.name
	);

	const totalWorkingHours = await account.getTotalWorkingHours();

	let newLevelName = journey[currentLevelIndex].level;

	if (totalWorkingHours >= journey[currentLevelIndex].requiredHours) {
		const haveIndexJourney = Math.ceil(
			currentLevelIndex +
				totalWorkingHours / journey[currentLevelIndex].requiredHours -
				1
		);

		newLevelName = journey[haveIndexJourney].level;
	}

	const updateAccountLevel = await Account.findByIdAndUpdate(
		req.params.domesticHelperId,
		{ 'accountLevel.domesticHelperLevel.name': newLevelName },
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updateAccountLevel,
		},
	});
});

const receiveGiftHistory = asyncHandler(async (req, res) => {
	const { domesticHelperId } = req.params;
	const { levelName, levelApoint } = req.body;

	const account = await Account.findById(domesticHelperId);

	if (!account) {
		return res.status(404).json({
			status: 'fail',
			message: 'Account not found',
		});
	}

	const giftLevel = account.receiveGiftHistory.find(
		(gift) => gift.levelName === String(levelName)
	);

	if (!giftLevel) {
		return res.status(404).json({
			status: 'fail',
			message: 'Gift level not found',
		});
	}

	// Kiểm tra xem quà tặng đã được nhận chưa
	if (giftLevel.isReceived) {
		return res.status(400).json({
			status: 'fail',
			message: 'Gift already received',
		});
	}

	if (!giftLevel.isReceived) {
		await Account.findByIdAndUpdate(
			domesticHelperId,
			{ aPoints: account.aPoints + levelApoint },
			{ new: true }
		);
	}

	// Cập nhật trạng thái isReceived thành true
	giftLevel.isReceived = true;

	await account.save();

	const updatedAccount = await Account.findByIdAndUpdate(
		domesticHelperId,
		{ $set: { receiveGiftHistory: account.receiveGiftHistory } },
		{ new: true }
	);

	res.status(200).json({
		status: 'success',
		data: {
			updatedAccount,
		},
	});
});

const updateAPoint = asyncHandler(async (req, res) => {
	const { accountId } = req.params;
	const { apoint, serviceId } = req.body;

	if (!accountId || !apoint) {
		return res
			.status(400)
			.json({ message: 'Account ID and points are required' });
	}

	try {
		const account = await Account.findById(accountId);

		if (!account) {
			return res.status(404).json({ message: 'Account not found' });
		}

		// Cập nhật aPoints
		console.log(
			Number(account.aPoints),
			Number(apoint),
			Number(account.aPoints) + Number(apoint)
		);
		account.aPoints = Number(account.aPoints) + Number(apoint);

		// Thêm vào lịch sử aPointHistory
		account.aPointHistory.push({
			apoint,
			serviceId,
		});

		await account.save();

		res.status(200).json({ message: 'aPoints updated successfully', account });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
});

const updateIsUsedVoucher = asyncHandler(async (req, res) => {
	const { voucherId } = req.params;
	const { isUsed, accountId } = req.body;

	const account = await Account.findById(accountId);

	if (!account) {
		res.status(404);
		throw new Error('Account not found!');
	}

	const voucher = account.accountVouchers.find(
		(v) => v.voucherId.toString() === voucherId
	);

	if (!voucher) {
		res.status(404);
		throw new Error('Voucher not found in account!');
	}

	voucher.isUsed = isUsed;

	await account.save();

	res.status(200).json({
		message: 'Voucher updated successfully',
		voucher,
	});
});

const updateRole = asyncHandler(async (req, res) => {
	const updatedAccount = await Account.findByIdAndUpdate(req.params.accountId, {
		role: 'Người giúp việc',
	});
	res.status(200).json({
		status: 'success',
		data: { updatedAccount },
	});
});

const getAllReports = asyncHandler(async (req, res) => {
	const numOfAccounts = await Account.find({});
	const numOfServices = await Service.find({});
	const numOfJobPosts = await JobPost.find({});

	res.status(200).json({
		status: 'success',
		data: {
			numOfAccounts: numOfAccounts.length,
			numOfServices: numOfServices.length,
			numOfJobPosts: numOfJobPosts.length,
		},
	});
});

module.exports = {
	register,
	login,
	updateAccountInformation,
	getAccountInformation,
	getAllAccounts,
	updateAccountForgottenPassword,
	getAccountForgottenPassword,
	addDomesticHelperToBlackList,
	addDomesticHelperToFavoriteList,
	deleteDomesticHelperFromBlackList,
	deleteDomesticHelperFromFavoriteList,
	inviteFriend,
	updateRatingDomesticHelper,
	checkInvitationCode,
	loadMoneyAfterUsingInvitationCode,
	getDomesticHelpersRanking,
	updateAPoint,
	updateIsUsedVoucher,
	getDomesticHelpersTotalWorkingHours,
	updateDomesticHelperLevel,
	receiveGiftHistory,
	blockAccount,
	updateRole,
	getAllReports,
};
