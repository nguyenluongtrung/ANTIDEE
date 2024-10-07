const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountVoucherSchema = new Schema(
    {
      accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
      voucherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Voucher",
      },
      isUsed:{
        type:Boolean,
        default: false
    }
    },
    {
      timestamps: true,
    }
  );
  
const accountVoucher = mongoose.model("AccountVoucher", accountVoucherSchema);
module.exports = accountVoucher;
