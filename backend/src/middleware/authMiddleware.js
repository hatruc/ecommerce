const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// xác thực quyền

// chỉ admin
const authAdminMiddleWare = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  // console.log("token", token);
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: err.message,
        status: "ERROR",
      });
    }
    // console.log(user);
    if (user?.role === "Admin") {
      next();
    } else {
      return res.status(401).json({
        message: "admin authentication error",
        status: "ERROR",
      });
    }
  });
};

// chỉ user có id giống id trên param
const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];
  const userId = req.params.userId;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: err.message,
        status: "ERROR",
      });
    }
    // console.log(user.id === userId);
    if (user?.id === userId) {
      req.loggedInUserRole = user.role;
      next();
    } else {
      return res.status(401).json({
        message: "user authentication error",
        status: "ERROR",
      });
    }
  });
};

// chỉ admin và user có id giống id trên param
const authAdminUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({
        message: err.message,
        status: "ERROR",
      });
    }
    // console.log(user);
    if (user?.role === "Admin" || user?.id === userId) {
      req.loggedInUserRole = user.role;
      next();
    } else {
      return res.status(401).json({
        message: "user admin authentication error",
        status: "ERROR",
      });
    }
  });
};

const authAdminStaffUserMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  // console.log('token:', token);
  const userId = req.params.id;
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      // console.log(err);
      return res.status(401).json({
        message: err.message,
        status: "ERROR",
      });
    }
    // console.log('user:', user);
    if (user?.role === "Admin" || user?.role === "Nhân viên" || user?.id === userId) {
      req.loggedInUserRole = user.role;
      next();
    } else {
      return res.status(401).json({
        message: "user admin staff authentication error",
        status: "ERROR",
      });
    }
  });
};

module.exports = {
  authAdminMiddleWare,
  authUserMiddleWare,
  authAdminUserMiddleWare,
  authAdminStaffUserMiddleWare,
};
