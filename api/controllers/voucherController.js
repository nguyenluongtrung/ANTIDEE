const Voucher = require("../models/voucherModel");
const Account = require("../models/accountModel")
const sendMail = require('../config/emailConfig');
const createVoucher = async (req, res) => {
  try {
    console.log('Creating voucher...');
    const voucher = await Voucher.create(req.body);
    console.log('Voucher created:', voucher);

    const accounts = await Account.find({});
    console.log('Accounts found:', accounts.length);

    for (let account of accounts) {
      console.log('Sending email to:', account.email);
      await sendMail({
        email: account.email,
        subject: "New Voucher Available!",
        html: `<p>Dear ${account.name},</p><p>A new voucher is available. Click to view it.</p>`
      });
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
        error: "Voucher not found",
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
        error: "Voucher not found",
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
        error: "Voucher not found",
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
  const { userId, voucherId } = req.body
  const user = await Account.findById(userId);
  const voucher = await Voucher.findById(voucherId);

  try {

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found." });
    }

    if (user.aPoints < voucher.price) {
      return res.status(400).json({ message: "Bạn không đủ điểm để đổi voucher này!!!" });

    }

    if (voucher.quantity > 0) {
      voucher.quantity -= 1;
      user.aPoints -= voucher.price;

      user.accountVouchers.push({ voucherId: voucher._id });
      voucher.voucherAccounts.push({ userId: user._id });

      await voucher.save();
      await user.save();
      return res.status(200).
        json({ message: 'Đổi voucher thành công', data: { voucher, account: user } });
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


module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  redeemVoucher
};
