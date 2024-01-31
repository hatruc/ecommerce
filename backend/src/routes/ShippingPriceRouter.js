const express = require("express");
const router = express.Router();
const ShippingPriceController = require("../controllers/ShippingPriceController");
const { authAdminMiddleWare } = require("../middleware/authMiddleware");

router.post(
  "/get-shipping-price",
  ShippingPriceController.getShippingPrice
);
router.post(
  "/create-shipping-price",
  authAdminMiddleWare,
  ShippingPriceController.createShippingPrice
);
router.put(
  "/update-shipping-price/:id",
  authAdminMiddleWare,
  ShippingPriceController.updateShippingPrice
);
router.delete(
  "/delete-shipping-price/:id",
  authAdminMiddleWare,
  ShippingPriceController.deleteShippingPrice
);
router.get(
  "/get-all-shipping-prices",
  authAdminMiddleWare,
  ShippingPriceController.getAllShippingPrices
);
router.post(
  "/delete-many-shipping-prices",
  authAdminMiddleWare,
  ShippingPriceController.deleteManyShippingPrices
);
router.get(
  "/get-details-shipping-price/:id",
  authAdminMiddleWare,
  ShippingPriceController.getDetailsShippingPrice
);
module.exports = router;
