const asyncHandler = require('express-async-handler');
const Account = require('./../models/accountModel');
const jwt = require('jsonwebtoken');

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
	const { email } = req.body;

	const accountExists = await Account.findOne({ email });

	if (accountExists) {
		res.status(400);
		throw new Error('Tài khoản đã tồn tại');
	}

	const account = await Account.create(req.body);

	if (account) {
		res.status(201).json({
			status: 'success',
			data: {
				account,
				token: generateToken(account._id),
			},
		});
	} else {
		res.status(400);
		throw new Error('Tài khoản không hợp lệ');
	}
});

const updateAccountInformation = asyncHandler(async (req, res) => {
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

const getAccountInformation = asyncHandler(async (req, res) => {
	const account = await Account.findById(req.account._id);

	res.status(200).json({
		status: 'success',
		data: {
			account,
		},
	});
});

module.exports = {
	register,
	login,
	updateAccountInformation,
	getAccountInformation,
};
