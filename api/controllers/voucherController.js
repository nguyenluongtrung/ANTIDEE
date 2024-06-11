const Voucher = require('../models/voucherModel');
const Account = require('../models/accountModel');
const sendMail = require('../config/emailConfig');
const createVoucher = async (req, res) => {
	try {
		const voucher = await Voucher.create(req.body);

		const accounts = await Account.find({});

		for (let account of accounts) {
			if (account.role !== 'Admin') {
				console.log('Sending email to:', account.email);
				await sendMail({
					email: account.email,
					subject: 'New Voucher Available!',
					html: `<body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; background-color: #F0F0F0; color: #000000; padding-bottom: 30px" bgcolor="#F0F0F0" text="#000000">
        <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background">
            <tr>
                <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0;" bgcolor="#F0F0F0">
                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="1000" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit; max-width: 1000px;" class="wrapper">
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 20px; padding-bottom: 20px;"></td>
                        </tr>
                    </table>
                    <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="1000" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit; max-width: 1000px;" class="container">
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%; padding-top: 25px; color: #000000; font-family: sans-serif;" class="header">
                                Voucher Mới Dành Cho Bạn
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%; padding-top: 5px; color: #000000; font-family: sans-serif;" class="subheader">
                                Nhận voucher ngay hôm nay và tiết kiệm hơn cho lần mua sắm tiếp theo của bạn!
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-top: 20px;" class="hero">
                                <a target="_blank" style="text-decoration: none;" href="#">
                                    <img border="0" vspace="0" hspace="0" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Christmas_presents.jpg/1280px-Christmas_presents.jpg" alt="Please enable images to view this content" title="Hero Image" width="1000px" style="width: 100%; max-width: 1000px; color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 25px; color: #000000; font-family: sans-serif;" class="paragraph">
                                <p>Chào <span style="font-style: italic">${
																	account.name
																}</span>,</p>
                                <p>Chúng tôi rất vui mừng thông báo rằng có một voucher mới với ưu đãi đặc biệt dành cho bạn.</p>
                                <p><strong>Chi tiết voucher:</strong></p>
                                <ul> 
                                    <li>Giảm giá: <strong>${
																			voucher.discountValue
																		}%</strong></li>
                                    <li>Hạn sử dụng: <strong>${new Date(
																			voucher.endDate
																		).toLocaleDateString()}</strong></li>
                                </ul>
                                <p>Hãy truy cập ngay vào trang web của chúng tôi để sử dụng voucher này và tiết kiệm hơn trong lần mua sắm tiếp theo!</p>
                                <p>Trân trọng,</p>
                                <p>Antidee Team</p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 25px; padding-bottom: 30px;" class="button">
                                <a href="http://localhost:5173/" target="_blank" style="text-decoration:none">
                                    <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;">
                                        <tr>
                                            <td align="center" valign="middle" style="text-decoration:none; padding: 12px 24px; margin: 0; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;" bgcolor="#E9703E">
                                                <a target="_blank" style="color: #FFFFFF; font-family: sans-serif; margin-bottom: 30px; font-size: 17px; font-weight: 400; line-height: 120%; text-decoration:none" href="http://localhost:5173/">
                                                    Truy cập vào trang web
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>`,
				});
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

const getVoucherById = async (req, res) => {
	try {
		const voucher = await Voucher.findById(req.params.voucherId);
		if (!voucher) {
			return res.status(404).json({
				success: false,
				error: 'Voucher not found',
			});
		}
		res.status(200).json({
			success: true,
			data: voucher,
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
	const { userId, voucherId } = req.body;
	const user = await Account.findById(userId);
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

			user.accountVouchers.push({ voucherId: voucher._id });
			voucher.voucherAccounts.push({ userId: user._id });

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
	const { userId } = req.params;

	try {
		const user = await Account.findById(userId).populate(
			'accountVouchers.voucherId'
		);

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		const redeemedVouchers = user.accountVouchers.map((voucher) => ({
			voucherId: voucher.voucherId._id,
			name: voucher.voucherId.name,
			description: voucher.voucherId.description,
			discountValue: voucher.voucherId.discountValue,
			brand: voucher.voucherId.brand,
			code: voucher.voucherId.code,
			endDate: voucher.voucherId.endDate,
			receivedAt: voucher.receivedAt,
			isUsed: voucher.isUsed,
		}));

		return res.status(200).json({ success: true, data: redeemedVouchers });
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
};
