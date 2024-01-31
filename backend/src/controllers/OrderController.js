const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      recipientName,
      address,
      phone,
      paymentMethod,
      itemsPrice,
      shippingFee,
      shippingPrice,
      totalPrice,
      user,
    } = req.body;
    if (
      !orderItems ||
      !recipientName ||
      !address ||
      !phone ||
      !paymentMethod ||
      !itemsPrice ||
      !shippingFee ||
      !shippingPrice ||
      !totalPrice ||
      !user
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await OrderService.createOrder(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getAllUserOrders(userId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderItems, orderId } = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.cancelOrder(orderId, orderItems);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const data = await OrderService.getAllOrders();
    return res.status(200).json(data);
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.updateStatus(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e)
    return res.status(404).json({
      message: e,
    });
  }
}

module.exports = {
  createOrder,
  getAllUserOrders,
  getDetailsOrder,
  cancelOrder,
  getAllOrders,
  updateStatus,
};
