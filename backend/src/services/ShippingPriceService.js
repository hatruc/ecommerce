const ShippingPrice = require("../models/ShippingPriceModel");

const createShippingPrice = (newShippingPrice) => {
  return new Promise(async (resolve, reject) => {
    const { maxOrderAmount } = newShippingPrice;
    try {
      const checkShippingPrice = await ShippingPrice.findOne({
        maxOrderAmount: maxOrderAmount,
      });
      if (checkShippingPrice !== null) {
        resolve({
          status: "ERR",
          message: "maxOrderAmount already exists",
        });
      } else {
        console.log('create');
        const createdShippingPrice = await ShippingPrice.create(newShippingPrice);
        if (createdShippingPrice) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdShippingPrice,
          });
        }
      }

    } catch (e) {
      reject(e);
    }
  });
};

const updateShippingPrice = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkShippingPrice = await ShippingPrice.findById(id);
      if (checkShippingPrice === null) {
        resolve({
          status: "ERR",
          message: "shippingPrice not found",
        });
      }

      // const checkAmountShippingPrice = await ShippingPrice.findOne({
      //   maxOrderAmount: data.maxOrderAmount,
      // });
      // console.log(checkAmountShippingPrice);
      // if (checkAmountShippingPrice !== null) {
      //   resolve({
      //     status: "ERR",
      //     message: "maxOrderAmount already exists",
      //   });
      // }

      const updatedShippingPrice = await ShippingPrice.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
        }
      );
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedShippingPrice,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteShippingPrice = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkShippingPrice = await ShippingPrice.findById(id);
      // console.log("checkShippingPrice", checkShippingPrice);
      if (checkShippingPrice === null) {
        resolve({
          status: "ERR",
          message: "shippingPrice not found",
        });
      }

      await ShippingPrice.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "delete shippingPrice success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyShippingPrice = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await ShippingPrice.deleteMany(ids);
      resolve({
        status: "OK",
        message: "delete categories success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllShippingPrices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allShippingPrices = await ShippingPrice.find().sort({
        createdAt: -1,
        updatedAt: -1,
      }); // sắp xếp theo thời gian giảm dần, nghĩa là mới nhât --> cập nhật gần nhất
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allShippingPrices,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getShippingPrice = (price) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const shippingPrice = await ShippingPrice.find({
      //   maxOrderAmount: { $gt: price }, // maxOrderAmount > price
      // })
      //   .sort({ maxOrderAmount: 1 }) // Sắp xếp theo thứ tự tăng dần của maxOrderAmount
      //   .limit(1); // Giới hạn chỉ lấy 1 kết quả
      let shippingPrice = await ShippingPrice.findOne({
        maxOrderAmount: { $gt: price }, // maxOrderAmount > price
      }).sort({ maxOrderAmount: 1 }); // Sắp xếp theo thứ tự tăng dần của maxOrderAmount
      if (!shippingPrice) {
        shippingPrice = await ShippingPrice.findOne({
          maxOrderAmount: null,
        })
      }
      // console.log('shippingPrice:', shippingPrice);
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: shippingPrice,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsShippingPrice = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shippingPrice = await ShippingPrice.findById(id);
      if (shippingPrice === null) {
        resolve({
          status: "ERR",
          message: "shippingPrice not found",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: shippingPrice,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createShippingPrice,
  updateShippingPrice,
  deleteShippingPrice,
  deleteManyShippingPrice,
  getAllShippingPrices,
  getShippingPrice,
  getDetailsShippingPrice,
};
