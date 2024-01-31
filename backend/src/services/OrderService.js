const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
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
    } = newOrder;
    try {
      const promises = orderItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            // find
            _id: item.product,
            quantityInStock: { $gte: item.quantity }, // quantityInStock >= item.quantity
          },
          {
            // update
            $inc: {
              quantityInStock: -item.quantity,
              sold: +item.quantity,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "ERR",
            name: item.name,
          };
        }
      });
      const results = await Promise.all(promises);
      const errorData =
        results && results.filter((item) => item.status === "ERR");
      if (errorData.length) {
        const arr = [];
        errorData.forEach((item) => {
          arr.push(item.name);
        });
        resolve({
          status: "ERR",
          message: `Sản phẩm: ${arr.join(",")} không đủ hàng`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            recipientName,
            address,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingFee,
          shippingPrice,
          totalPrice,
          user,
        });
        if (createdOrder) {
          resolve({
            status: "OK",
            message: "SUCCESS",
            data: createdOrder,
          });
        }
      }
    } catch (e) {
      //   console.log('e', e)
      reject(e);
    }
  });
};

const getAllUserOrders = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      }).sort({ createdAt: -1, updatedAt: -1 });
      if (order === null) {
        resolve({
          status: "ERR",
          message: "order not found",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id);
      if (order === null) {
        resolve({
          status: "ERR",
          message: "order not found",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      // console.log('e', e)
      reject(e);
    }
  });
};

const cancelOrder = (id, orderItems) => {
  return new Promise(async (resolve, reject) => {
    try {
      const promises = orderItems.map(async (item) => {
        const productData = await Product.findOneAndUpdate(
          {
            // find
            _id: item.product,
            sold: { $gte: item.quantity }, // sold >= item.quantity
          },
          {
            // update
            $inc: {
              quantityInStock: +item.quantity,
              sold: -item.quantity,
            },
          },
          { new: true }
        );
        if (productData) {
          return {
            status: "OK",
            message: "SUCCESS",
          };
        } else {
          return {
            status: "ERR",
            name: item.name,
          };
        }
      });
      await Promise.all(promises);

      const order = await Order.findByIdAndDelete(id);
      if (order === null) {
        resolve({
          status: "ERR",
          message: "order not found",
        });
      } else {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: order,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateStatus = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkOrder = await Order.findById(id);

      if (checkOrder === null) {
        resolve({
          status: "ERR",
          message: "order not found",
        });
      }

      checkOrder.currentStatus = data.status;
      checkOrder.updateHistory.push(data);

      const order = await Order.findByIdAndUpdate(id, checkOrder, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllUserOrders,
  getDetailsOrder,
  cancelOrder,
  getAllOrders,
  updateStatus,
};
