const asyncHandler = require("express-async-handler");
const Account = require("./../models/accountModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: "30d",
  });
};

const login = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  const account = await Account.findOne({ phoneNumber }).select("+password");

  if (
    account &&
    (await account.comparePasswordInDb(password, account.password))
  ) {
    res.status(200).json({
      status: "success",
      data: {
        account,
        token: generateToken(account._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Số điện thoại hoặc mật khẩu không đúng");
  }
});

const register = asyncHandler(async (req, res) => {
  // const { email, phoneNumber } = req.body;
  const { phoneNumber } = req.body;

  // const accountExistsByEmail = await Account.findOne({ email });

  // if (accountExistsByEmail) {
  // 	res.status(400);
  // 	throw new Error('Email đã tồn tại');
  // }

  const accountExistsByPhoneNumber = await Account.findOne({ phoneNumber });

  if (accountExistsByPhoneNumber) {
    res.status(400);
    throw new Error("Số điện thoại đã tồn tại");
  }

  const account = await Account.create(req.body);

  if (account) {
    res.status(201).json({
      status: "success",
      data: {
        account,
        // token: generateToken(account._id),
      },
    });
  } else {
    res.status(400);
    throw new Error("Tài khoản không hợp lệ");
  }
});

const getAllAccounts = asyncHandler(async (req, res) => {
  const accounts = await Account.find({});

  res.status(200).json({
    status: "success",
    data: {
      accounts,
    },
  });
});

const updateAccountInformation = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;

  const accountExistsByEmail = await Account.findOne({ email });

  if (email !== req.account.email && accountExistsByEmail) {
    res.status(400);
    throw new Error("Email đã tồn tại");
  }

  const accountExistsByPhoneNumber = await Account.findOne({ phoneNumber });

  if (phoneNumber !== req.account.phoneNumber && accountExistsByPhoneNumber) {
    res.status(400);
    throw new Error("Số điện thoại đã tồn tại");
  }

  const updatedAccount = await Account.findByIdAndUpdate(
    req.account._id,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedAccount,
    },
  });
});

const updateAccountForgottenPassword = asyncHandler(async (req, res) => {
  const accountId = req.params.accountId;

  let { password } = req.body;

  password = await bcrypt.hash(password, 12);

  const updatedAccount = await Account.findByIdAndUpdate(
    accountId,
    { password },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedAccount,
    },
  });
});

const getAccountForgottenPassword = asyncHandler(async (req, res) => {
  const account = await Account.find({ phoneNumber: req.params.phoneNumber });

  res.status(200).json({
    status: "success",
    data: {
      singleAccount: account[0],
    },
  });
});

const getAccountInformation = asyncHandler(async (req, res) => {
  const account = await Account.findById(req.account._id)
  .populate('blackList.domesticHelperId')
  .populate('favoriteList.domesticHelperId');

  if(!account){
    res.status(404);
    throw new Error('Account not found');
  }
  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

//Black list
const addDomesticHelperToBlackList = asyncHandler(async (req, res) => {
  const accountId = req.account._id;
  const { domesticHelperId } = req.params;

  if (accountId.toString() === domesticHelperId.toString()) {
    res.status(400);
    throw new Error("Không thể thêm chính mình vào danh sách hạn chế !!!");
  }

  const account = await Account.findById(accountId);

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }
  const isAlreadyInFavoriteList = account.favoriteList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );

  if (isAlreadyInFavoriteList) {
    res.status(400);
    throw new Error("Người này đã có trong danh sách yêu thích của bạn !!!");
  }

  const isAlreadyInBlackList = account.blackList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );

  if (isAlreadyInBlackList) {
    res.status(400);
    throw new Error("Người này đã có trong danh sách đen của bạn !!!");
  }

  account.blackList.push({ domesticHelperId });

  await account.save();

  res.status(201).json({
    status: "success",
    data: {
      account,
    },
  });
});
const deleteDomesticHelperFromBlackList = asyncHandler(async (req, res) => {
  const accountId = req.account._id;
  const { domesticHelperId } = req.params;

  const account = await Account.findById(accountId);

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  const isInBlackList = account.blackList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );

  if (!isInBlackList) {
    res.status(400);
    throw new Error(
      "Người này không có trong danh sách yêu hạn chế của bạn !!!"
    );
  }

  account.blackList = account.blackList.filter(
    (item) => item.domesticHelperId.toString() !== domesticHelperId
  );

  await account.save();

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});



//Favorite list
const addDomesticHelperToFavoriteList = asyncHandler(async (req, res) => {
  const accountId = req.account._id;
  const { domesticHelperId } = req.params;

  if (accountId.toString() === domesticHelperId.toString()) {
    res.status(400);
    throw new Error("Không thể thêm chính mình vào danh sách yêu thích !!!");
  }

  const account = await Account.findById(accountId);

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }
  const isAlreadyInBlackList = account.blackList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );

  if (isAlreadyInBlackList) {
    res.status(400);
    throw new Error("Người này đã có trong danh sách đen của bạn !!!");
  }

  const isAlreadyInFavoriteList = account.favoriteList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );
  if (isAlreadyInFavoriteList) {
    res.status(400);
    throw new Error("Người này đã có trong danh sách yêu thích của bạn !!!");
  }

  account.favoriteList.push({ domesticHelperId });

  await account.save();

  res.status(201).json({
    status: "success",
    data: {
      account,
    },
  });
});

const deleteDomesticHelperFromFavoriteList = asyncHandler(async (req, res) => {
  const accountId = req.account._id;
  const { domesticHelperId } = req.params;

  const account = await Account.findById(accountId);

  if (!account) {
    res.status(404);
    throw new Error("Account not found");
  }

  const isInFavoriteList = account.favoriteList.some(
    (item) => item.domesticHelperId.toString() === domesticHelperId
  );

  if (!isInFavoriteList) {
    res.status(400);
    throw new Error("Người này không có trong danh sách yêu thích của bạn !!!");
  }

  account.favoriteList = account.favoriteList.filter(
    (item) => item.domesticHelperId.toString() !== domesticHelperId
  );

  await account.save();

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

module.exports = {
  register,
  login,
  updateAccountInformation,
  getAccountInformation,
  getAllAccounts,
  updateAccountForgottenPassword,
  getAccountForgottenPassword,
  addDomesticHelperToBlackList,
  addDomesticHelperToFavoriteList,
  deleteDomesticHelperFromBlackList,
  deleteDomesticHelperFromFavoriteList,
};
