const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    couponType: {
      type: String,
      enum: ["Voucher", "Promotion"],
      required: true,
    },
    startDate: {
      type: Date,
      // required: true
    },

    endDate: {
      type: Date,
      // required: true
    },

    discountValue: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Enable", "Disable"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    serviceId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Service",
      }
    ],
    category: {
      type: String,
      enum: ["Mua sắm", "Dịch vụ", "Giải trí", "Du lịch", "Ẩm thực"],
      required: true,
    },
    image: {
      type: String,
      // required: true
    },
  },
  {
    timestamps: true,
  }
);



const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;