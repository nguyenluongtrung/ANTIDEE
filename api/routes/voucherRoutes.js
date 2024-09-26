const express = require("express");
const { protect, restrict } = require("../middleware/accountMiddleware");
const {
  createVoucher,
  getAllVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  redeemVoucher,
  getRedeemedVouchers,
  getAllAccountVouchers,
} = require("../controllers/voucherController");
const router = express.Router();

router
  .route("/")
  .post(protect, restrict("Admin"), createVoucher)
  .get(getAllVouchers);
router.route("/accountVoucher/:accountId").get(getAllAccountVouchers);

router
  .route("/:voucherId")
  // .get(getVoucherById)
  .delete(protect, restrict("Admin"), deleteVoucher)
  .patch(protect, restrict("Admin"), updateVoucher);

router
  .route("/:voucherId/:accountId")
  .get(getVoucherById);

router.route("/redeemVoucher").post(redeemVoucher);


router.route("/redeemed/:userId").get(getRedeemedVouchers);

module.exports = router;
