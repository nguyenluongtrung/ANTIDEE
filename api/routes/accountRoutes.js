const express = require("express");
const {
  login,
  register,
  updateAccountInformation,
  getAccountInformation,
  getAllAccounts,
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
module.exports = router;
