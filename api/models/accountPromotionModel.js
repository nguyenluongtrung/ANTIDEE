const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountPromotionSchema = new Schema(
    {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      promotionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
      },
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      }
    },
    {
      timestamps: true,
    }
  );
  

module.exports = mongoose.model("AccountPromotion", accountPromotionSchema);
