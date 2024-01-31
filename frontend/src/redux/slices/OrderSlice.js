import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    user: "",
    paymentMethod: "",
    itemsPrice: 0,
    shippingFee: 0,
    shippingPrice: "",
    totalPrice: 0,
    currentStatus: "",
    updateHistory: [],
  },
];

export const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    initOrder: (state, action) => {
      const { userId } = action.payload;
      const order = state.find((order) => order.user === "");
      if (order) order.user = userId;
      else
        state.push({
          orderItems: [],
          orderItemsSelected: [],
          shippingAddress: {},
          user: userId,
          paymentMethod: "",
          itemsPrice: 0,
          shippingFee: 0,
          shippingPrice: "",
          totalPrice: 0,
          currentStatus: "",
          updateHistory: [],
        });
    },
    addOrderItem: (state, action) => {
      const { orderItem, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);
      const itemOrder = userOrder.orderItems.find(
        (item) => item.product === orderItem.product
      );

      if (itemOrder) {
        if (itemOrder.quantity <= itemOrder.quantityInStock) {
          itemOrder.quantity += orderItem.quantity;
        }
      } else {
        userOrder.orderItems.push(orderItem);
      }
    },
    changeAmount: (state, action) => {
      const { idProduct, value, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);
      const itemOrder = userOrder.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = userOrder.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.quantity = value;
      if (itemOrderSelected) {
        itemOrderSelected.quantity = value;
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      const itemOrder = userOrder.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = userOrder.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.quantity++;
      if (itemOrderSelected) {
        itemOrderSelected.quantity++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      const itemOrder = userOrder.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = userOrder.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.quantity--;
      if (itemOrderSelected) {
        itemOrderSelected.quantity--;
      }
    },
    removeOrderItem: (state, action) => {
      const { idProduct, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      const itemOrder = userOrder.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const itemOrderSelected = userOrder.orderItemsSelected?.filter(
        (item) => item?.product !== idProduct
      );

      userOrder.orderItems = itemOrder;
      userOrder.orderItemsSelected = itemOrderSelected;
    },
    removeAllOrderItem: (state, action) => {
      const { listChecked, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      const itemOrders = userOrder.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      const itemOrdersSelected = userOrder.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      userOrder.orderItems = itemOrders;
      userOrder.orderItemsSelected = itemOrdersSelected;
    },
    selectedOrderItem: (state, action) => {
      const { listChecked, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      const orderItemsSelected = [];
      userOrder.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderItemsSelected.push(order);
        }
      });
      userOrder.orderItemsSelected = orderItemsSelected;
    },
    updateShippingAddress: (state, action) => {
      const { recipientName, address, phone, userId } = action.payload;
      const userOrder = state.find((order) => order.user === userId);

      userOrder.shippingAddress = {
        recipientName: recipientName,
        address: address,
        phone: phone,
      };
    },
    updateOrder: (state, action) => {
      const {
        userId,
        itemsPrice,
        shippingFee,
        shippingPrice,
        totalPrice,
        paymentMethod,
      } = action.payload;
      const userOrder = state.find((order) => order.user === userId);
      
      userOrder.itemsPrice = itemsPrice;
      userOrder.shippingFee = shippingFee;
      userOrder.shippingPrice = shippingPrice;
      userOrder.totalPrice = totalPrice;
      userOrder.paymentMethod = paymentMethod;

    },
  },
});

// Action creators are generated for each case reducer function
export const {
  initOrder,
  addOrderItem,
  changeAmount,
  increaseAmount,
  decreaseAmount,
  removeOrderItem,
  removeAllOrderItem,
  selectedOrderItem,
  resetOrder,
  updateShippingAddress,
  updateOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
