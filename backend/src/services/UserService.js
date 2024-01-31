const User = require("../models/UserModel");
// const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { email } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "email already exists",
        });
      }
      // const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create(newUser);
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const login = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      // console.log(checkUser);
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "user does not exist",
        });
      }
      // const comparePassword = bcrypt.compareSync(password, checkUser.password);
      // console.log(comparePassword);
      if (password !== checkUser.password) {
        resolve({
          status: "ERR",
          message: "password is incorrect",
        });
      }
      const access_token = await generateAccessToken({
        id: checkUser.id,
        role: checkUser.role,
      });

      const refresh_token = await generateRefreshToken({
        id: checkUser.id,
        role: checkUser.role,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data, loggedInUserRole) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);

      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "user not found",
        });
      }
      if (data.email) {
        return resolve({
          status: "ERR",
          message: "email can't be updated",
        });
      }
      if (data.role && loggedInUserRole !== "Admin") {
        return resolve({
          status: "ERR",
          message: "Only Admin can update role",
        });
      }

      // if(data.password){
      //   data.password = bcrypt.hashSync(data.password, 10);
      // }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findById(id);
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "user not found",
        });
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUsers = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "delete users success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 }); // sắp xếp theo thời gian giảm dần, nghĩa là mới nhât --> cập nhật gần nhất
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (user === null) {
        resolve({
          status: "ERR",
          message: "user not found",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  deleteManyUsers,
};
