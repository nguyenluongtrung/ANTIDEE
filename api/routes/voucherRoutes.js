const express = require('express');
const { protect, restrict } = require('../middleware/accountMiddleware');
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  getRedeemedVouchers  // Import the new function
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
  .route('/redeemed/:userId')  // Add this new route
  .get(getRedeemedVouchers);

module.exports = router;
