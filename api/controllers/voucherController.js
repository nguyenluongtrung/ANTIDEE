  const Voucher = require("../models/voucherModel");
  const Account = require("../models/accountModel");

  const createVoucher = async (req, res) => {
    try {
      const voucher = await Voucher.create(req.body);
      res.status(201).json({
        success: true,
        data: voucher,
      });
    } catch (error) {
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
    const { userId, voucherId } = req.body;
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
        return res.status(200).json({ message: 'Đổi voucher thành công', data: { voucher, account: user } });
      } else {
        return res.status(400).json({ message: 'Rất tiếc voucher này đã hết!' });
      }
    } catch (error) {
      res.status (500).json({
        success: false,
        error: error.message,
      });
    }
  };

  const getRedeemedVouchers = async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await Account.findById(userId).populate('accountVouchers.voucherId');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const redeemedVouchers = user.accountVouchers.map(voucher => ({
        voucherId: voucher.voucherId._id,
        name: voucher.voucherId.name,
        description: voucher.voucherId.description,
        discountValue: voucher.voucherId.discountValue,
        brand:voucher.voucherId.brand,
        code:voucher.voucherId.code,
        endDate:voucher.voucherId.endDate,
        receivedAt: voucher.receivedAt,
        isUsed: voucher.isUsed
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
