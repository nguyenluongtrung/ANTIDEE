const Voucher = require("../models/voucherModel");

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
      data: {updatedVoucher},
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

module.exports = {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
};
