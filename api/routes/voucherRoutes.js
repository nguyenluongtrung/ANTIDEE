const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  historyVoucher
} = require('../controllers/voucherController');
const router = express.Router();

router
  .route('/')
  .post(protect, restrict('Admin'), createVoucher)
  .get(getAllVouchers);

router
  .route('/:voucherId')
  .get(getVoucherById)
  .delete(protect, restrict('Admin'), deleteVoucher)
  .patch(protect, restrict('Admin'), updateVoucher);

router
  .route('/redeemVoucher')
  .post(redeemVoucher);

router
  .route('/historyVoucher')
  .get(protect, historyVoucher);

  
module.exports = router;
