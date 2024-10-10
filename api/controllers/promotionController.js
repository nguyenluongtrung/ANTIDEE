const asyncHandler = require("express-async-handler");
const Promotion = require("./../models/promotionModel");
const Service = require("./../models/serviceModel");
const Account = require("../models/accountModel");
const AccountPromotion = require("../models/accountPromotionModel");
const sendMail = require("../config/emailConfig");
const emailTemplate = require("../utils/sampleEmailForm");

const getAllPromotions = asyncHandler(async (req, res) => {
  const promotions = await Promotion.find({}).populate(
    "serviceIds",
    "name description"
  );

  res.status(200).json({
    status: "success",
    data: {
      promotions,
    },
  });
});

const getPromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findOne({
    _id: req.params.promotionId,
    startDate: { $lte: Date.now() },
    endDate: { $gte: Date.now() },
  });

  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found!");
  }

  res.status(200).json({
    status: "success",
    data: {
      promotion,
    },
  });
});

const updatePromotion = asyncHandler(async (req, res) => {
  const oldPromotion = await Promotion.findById(req.params.promotionId);

  if (!oldPromotion) {
    res.status(404);
    throw new Error("Promotion not found!");
  }

  const { serviceIds } = req.body;
  const oldServiceIds = oldPromotion.serviceIds;

  await Service.updateMany(
    { _id: { $in: oldServiceIds } },
    { $pull: { promotionIds: req.params.promotionId } }
  );

  const updatedPromotion = await Promotion.findByIdAndUpdate(
    req.params.promotionId,
    req.body,
    { new: true }
  );

  await Service.updateMany(
    { _id: { $in: serviceIds } },
    { $addToSet: { promotionIds: req.params.promotionId } }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedPromotion,
    },
  });
});

const deletePromotion = asyncHandler(async (req, res) => {
  const oldPromotion = await Promotion.findById(req.params.promotionId);

  if (!oldPromotion) {
    res.status(404);
    throw new Error("Promotion not found!");
  }

  const oldServiceIds = oldPromotion.serviceIds;
  await Service.updateMany(
    { _id: { $in: oldServiceIds } },
    { $pull: { promotionIds: req.params.promotionId } }
  );

  await Promotion.findByIdAndDelete(req.params.promotionId);

  res.status(200).json({
    status: "success",
    data: {
      oldPromotion,
    },
  });
});

const updatePromotionQuantity = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.promotionId);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }
    const quantity = req.body.quantity;
    promotion.promotionQuantity = quantity;
    await promotion.save();

    // Return a success response
    return res.status(200).json({
      message: "Promotion quantity updated successfully",
      updatedPromotion: promotion,
    });
  } catch (error) {
    // Handle any errors
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const createPromotion = async (req, res) => {
  try {
    const { serviceIds } = req.body;
    const newPromotion = await Promotion.create(req.body);

    await Service.updateMany(
      { _id: { $in: serviceIds } },
      { $addToSet: { promotionIds: newPromotion._id } }
    );

    const accounts = await Account.find({});

    for (let account of accounts) {
      if (account.role !== "Admin") {
        console.log("Sending email to:", account.email);
        let email = {
          toEmail: account.email,
          subject: "CHƯƠNG TRÌNH KHUYẾN MẠI ĐANG CHỜ BẠN",
          header: "Antidee có chương trình sale sập sàn mới dành cho bạn",
          imageUrl:
            "https://seotrends.com.vn/wp-content/uploads/2023/06/banner-sale-3d-1-1024x683.jpg",
          mainContent: `
					 
					<p>Xin chào <span style="font-weight: bold">${
            account?.name
          }</span> Chúng tôi rất vui mừng thông báo rằng đã có một chương trình sale với ưu đãi đặc biệt dành cho bạn.</p>
					<p>Giảm giá sốc lên tới: <strong style="color:red">${
            newPromotion.promotionValue * 100
          }%</strong></p>
					<p>Hãy truy cập ngay vào trang web của chúng tôi để trãi nghiệm các dịch vụ với giá chưa từng có!</p>
					<p>Trân trọng,</p>
					<p>Antidee Team</p>
				`,
        };
        await sendMail(emailTemplate(email));
      }
    }

    res.status(201).json({
      success: true,
      data: newPromotion,
    });
  } catch (error) {
    console.error("Error creating promotion or sending emails:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const createAccountPromotion = async (req, res) => {
  try {
    const { accountId, promotionId, serviceId } = req.body;

    const newAccountPromotion = new AccountPromotion({
      accountId,
      promotionId,
      serviceId,
    });

	await newAccountPromotion.save();

	res.status(201).json({
		success: true,
		message: "Account Promotion created successfully",
		data: newAccountPromotion
	  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};



const getAllAccountPromotion = async (req, res) => {
	try {
		// Query the account promotions by accountId
		const accountPromotions = await AccountPromotion.find({
			accountId: req.params.accountId,
		});

		// Check if promotions are found
		if (!accountPromotions.length) {
			return res.status(200).json({
        success: true,
        data: { accountPromotions: [] },
      });
		}
		res.status(200).json({
			success: true,
			data: { accountPromotions },
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Server Error",
			error: error.message,
		});
	}
};


module.exports = {
  getAllPromotions,
  getPromotion,
  updatePromotion,
  deletePromotion,
  createPromotion,
  updatePromotionQuantity,
  createAccountPromotion,
  getAllAccountPromotion,
};
