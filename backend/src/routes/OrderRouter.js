const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authUserMiddleWare,
  authAdminMiddleWare,
} = require("../middleware/authMiddleware");

router.post(
  "/create-order/:userId",
  authUserMiddleWare,
  OrderController.createOrder
);
router.get(
  "/get-all-user-orders/:userId",
  authUserMiddleWare,
  OrderController.getAllUserOrders
);
router.put(
  "/cancel-order/:userId",
  authUserMiddleWare,
  OrderController.cancelOrder
);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.get(
  "/get-all-orders",
  authAdminMiddleWare,
  OrderController.getAllOrders
);
router.put(
  "/update-status/:id",
  authAdminMiddleWare,
  OrderController.updateStatus
);

module.exports = router;
