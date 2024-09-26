const Voucher = require('../models/voucherModel');
const AccountVoucher = require('../models/accountVoucherModel')
const Account = require('../models/accountModel');
const sendMail = require('../config/emailConfig');
const emailTemplate = require('../utils/sampleEmailForm');

const createVoucher = async (req, res) => {
	try {
		const voucher = await Voucher.create(req.body);
		const accounts = await Account.find({});

		for (let account of accounts) {
			if (account.role !== 'Admin') {
				console.log('Sending email to:', account.email);
				let email = {
					toEmail: account.email,
					subject: 'MÃ GIẢM GIÁ MỚI ĐANG CHỜ BẠN',
					header: 'Antidee có mã khuyến mại mới dành cho bạn',
					imageUrl:
						'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Christmas_presents.jpg/1280px-Christmas_presents.jpg',
					mainContent: `
					 
					<p>Xin chào <span style="font-weight: bold">${account?.name}</span> Chúng tôi rất vui mừng thông báo rằng có một voucher mới với ưu đãi đặc biệt dành cho bạn.</p>
					<p>Giảm giá sốc lên tới: <strong style="color:red">${voucher.discountValue}%</strong></p>
					<p>Nhận voucher ngay hôm nay và tiết kiệm hơn cho lần mua sắm tiếp theo của bạn!</p>
					<p>Hãy truy cập ngay vào trang web của chúng tôi để sử dụng voucher này và tiết kiệm hơn trong lần mua sắm tiếp theo!</p>
					<p>Trân trọng,</p>
					<p>Antidee Team</p>
				`,
				};
				await sendMail(emailTemplate(email));
			}
		}

		res.status(201).json({
			success: true,
			data: voucher,
		});
	} catch (error) {
		console.error('Error creating voucher or sending emails:', error);
		res.status(400).json({
			success: false,
			error: error.message,
		});
	}
};

const getAllVouchers = async (req, res) => {
	try {
		const vouchers = await Voucher.find({});
		res.status(200).json({
			success: true,
			data: { vouchers },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const getAllAccountVouchers = async (req, res) => {
	try {

		const accountVouchers = await AccountVoucher.find({ accountId: req.params.accountId });
		res.status(200).json({
			success: true,
			data: { accountVouchers },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const getVoucherById = async (req, res) => {
	try {
		const voucher = await Voucher.findById(req.params.voucherId);
		const accountVouchers = await AccountVoucher.find({ accountId: req.params.accountId });
		if (!voucher) {
			return res.status(404).json({
				success: false,
				error: 'Voucher not found',
			});
		}
		const isMyVoucher = accountVouchers.find((accountVoucher) => String(accountVoucher.voucherId) == String(voucher._id)) ? true : false
		res.status(200).json({
			success: true,
			data: { ...voucher._doc, isMyVoucher },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const updateVoucher = async (req, res) => {
	try {
		const findVoucher = await Voucher.findById(req.params.voucherId);

		if (!findVoucher) {
			return res.status(404).json({
				success: false,
				error: 'Voucher not found',
			});
		}

		const updatedVoucher = await Voucher.findByIdAndUpdate(
			req.params.voucherId,
			req.body,
			{ new: true }
		);
		res.status(200).json({
			success: true,
			data: { updatedVoucher },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const deleteVoucher = async (req, res) => {
	try {
		const voucher = await Voucher.findByIdAndDelete(req.params.voucherId);
		if (!voucher) {
			return res.status(404).json({
				success: false,
				error: 'Voucher not found',
			});
		}
		res.status(200).json({
			success: true,
			data: {
				id: req.params.voucherId,
			},
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const redeemVoucher = async (req, res) => {
	const { accountId, voucherId } = req.body;
	const user = await Account.findById(accountId);
	const voucher = await Voucher.findById(voucherId);

	try {
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		if (!voucher) {
			return res.status(404).json({ message: 'Voucher not found.' });
		}

		if (user.aPoints < voucher.price) {
			return res
				.status(400)
				.json({ message: 'Bạn không đủ điểm để đổi voucher này!!!' });
		}

		if (voucher.quantity > 0) {
			voucher.quantity -= 1;
			user.aPoints -= voucher.price;
			const accountVoucher = new AccountVoucher({
				accountId: user._id,
				voucherId: voucher._id,
			});

			await accountVoucher.save();
			await voucher.save();
			await user.save();

			return res.status(200).json({
				message: 'Đổi voucher thành công',
				data: { voucher, account: user },
			});
		} else {
			return res.status(400).json({ message: 'Rất tiếc voucher này đã hết!' });
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

const getRedeemedVouchers = async (req, res) => {
	const { accountId } = req.params;

	try {
		const user = await Account.findById(accountId);
		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		const redeemedVouchers = await AccountVoucher.find({ accountId: user._id })
			.populate('voucherId');

		const formattedVouchers = redeemedVouchers.map((accountVoucher) => ({
			voucherId: accountVoucher.voucherId._id,
			name: accountVoucher.voucherId.name,
			description: accountVoucher.voucherId.description,
			discountValue: accountVoucher.voucherId.discountValue,
			code: accountVoucher.voucherId.code,
			endDate: accountVoucher.voucherId.endDate,
			receivedAt: accountVoucher.createdAt, // sử dụng createdAt từ AccountVoucher
			image: accountVoucher.voucherId.image,
		}));

		return res.status(200).json({ success: true, data: formattedVouchers });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
};


module.exports = {
	createVoucher,
	getAllVouchers,
	getVoucherById,
	updateVoucher,
	deleteVoucher,
	redeemVoucher,
	getRedeemedVouchers,
	getAllAccountVouchers
};
