const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      recipientName: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: Number, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    shippingPrice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingPrice",
      required: true,
    },
    totalPrice: { type: Number, required: true },
    currentStatus: { type: String, default: "Chờ xử lý" },
    updateHistory: [
      {
        status: { type: String },
        updater: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
