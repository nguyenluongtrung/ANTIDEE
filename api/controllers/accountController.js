const asyncHandler = require('express-async-handler');
const Account = require('./../models/accountModel');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET_STR, {
		expiresIn: '30d',
	});
};

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const account = await Account.findOne({ email }).select('+password');

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
		throw new Error('Email or password is invalid!');
	}
});

const register = asyncHandler(async (req, res) => {
	const { email } = req.body;

	const accountExists = await Account.findOne({ email });

	if (accountExists) {
		res.status(400);
		throw new Error('Account already exists');
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
		throw new Error('Invalid accound data');
	}
});

module.exports = {
	register,
	login,
};
