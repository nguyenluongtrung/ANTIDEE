const express = require("express");
const {
  login,
  register,
  updateAccountInformation,
  getAccountInformation,
  getAllAccounts,
  updateAccountForgottenPassword,
  getAccountForgottenPassword
} = require("../controllers/accountController");
const { protect } = require("../middleware/accountMiddleware");
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);

router
  .route("/information")
  .patch(protect, updateAccountInformation)
  .get(protect, getAccountInformation);
router.route("/").get(getAllAccounts);
router.route("/lost-account/:phoneNumber").get(getAccountForgottenPassword);
router.route("/lost-account/:accountId").patch(updateAccountForgottenPassword);

module.exports = router;
