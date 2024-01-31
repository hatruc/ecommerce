const mongoose = require("mongoose");
const shippingPriceSchema = new mongoose.Schema(
  {
    maxOrderAmount: {
      type: Number,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ShippingPrice = mongoose.model("ShippingPrice", shippingPriceSchema);
module.exports = ShippingPrice;
