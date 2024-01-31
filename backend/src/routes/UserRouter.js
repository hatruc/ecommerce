const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authAdminUserMiddleWare,
  authAdminMiddleWare,
  authAdminStaffUserMiddleWare,
} = require("../middleware/authMiddleware");

router.post("/sign-up", UserController.signUp);
router.post("/sign-in", UserController.login);
router.post("/log-out", UserController.logout);
router.post("/create-user", authAdminMiddleWare, UserController.createUser);
router.put(
  "/update-user/:id",
  authAdminUserMiddleWare,
  UserController.updateUser
);
router.delete(
  "/delete-user/:id",
  authAdminMiddleWare,
  UserController.deleteUser
);
router.get("/get-all-users", authAdminMiddleWare, UserController.getAllUsers);
router.get(
  "/get-details-user/:id",
  authAdminStaffUserMiddleWare,
  UserController.getDetailsUser
);
router.post("/refresh-token", UserController.refreshToken);
router.post(
  "/delete-many-users",
  authAdminMiddleWare,
  UserController.deleteManyUsers
);

module.exports = router;
