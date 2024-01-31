const ShippingPriceService = require("../services/ShippingPriceService");

const createShippingPrice = async (req, res) => {
  try {
    const { shippingFee } = req.body;
    if (!shippingFee) {
      return res.status(200).json({
        status: "ERR",
        message: "input is required",
      });
    }
    const response = await ShippingPriceService.createShippingPrice(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updateShippingPrice = async (req, res) => {
  try {
    const shippingPriceId = req.params.id;
    const data = req.body;
    if (!shippingPriceId) {
      return res.status(200).json({
        status: "ERR",
        message: "shippingPriceId is required",
      });
    }
    const response = await ShippingPriceService.updateShippingPrice(
      shippingPriceId,
      data
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteShippingPrice = async (req, res) => {
  try {
    const shippingPriceId = req.params.id;
    if (!shippingPriceId) {
      return res.status(200).json({
        status: "ERR",
        message: "shippingPriceId is required",
      });
    }
    const response = await ShippingPriceService.deleteShippingPrice(
      shippingPriceId
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteManyShippingPrices = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "ids is required",
      });
    }
    const response = await ShippingPriceService.deleteManyShippingPrice(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllShippingPrices = async (req, res) => {
  try {
    const response = await ShippingPriceService.getAllShippingPrices();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getShippingPrice = async (req, res) => {
  try {
    const { price } = req.body;
    // console.log('req.body:', req.body);
    // console.log('price:', price);
    if(!price){
      return res.status(200).json({
        status: "ERR",
        message: "price is required",
      });
    }
    const response = await ShippingPriceService.getShippingPrice(price);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsShippingPrice = async (req, res) => {
  try {
    const shippingPriceId = req.params.id;
    if (!shippingPriceId) {
      return res.status(200).json({
        status: "ERR",
        message: "shippingPriceId is required",
      });
    }
    const response = await ShippingPriceService.getDetailsShippingPrice(
      shippingPriceId
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createShippingPrice,
  updateShippingPrice,
  deleteShippingPrice,
  deleteManyShippingPrices,
  getAllShippingPrices,
  getShippingPrice,
  getDetailsShippingPrice,
};
