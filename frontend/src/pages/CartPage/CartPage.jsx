import { Form } from "antd";
import React, { useEffect, useState } from "react";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperInfoBody,
  WrapperItemOrder,
  WrapperItemPrice,
  WrapperLeft,
  WrapperLimitOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperTotal,
} from "./style";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";

import { WrapperInputNumber } from "../../components/ProductDetailsComponent/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  changeAmount,
  increaseAmount,
  decreaseAmount,
  removeAllOrderItem,
  removeOrderItem,
  selectedOrderItem,
  updateShippingAddress,
  updateOrder,
} from "../../redux/slices/OrderSlice";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
import * as ShippingPriceService from "../../services/ShippingPriceService";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/LoadingComponent/Loading";
const CartPage = () => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) =>
    state.orders?.find((order) => order.user === user.id)
  );
  // console.log(order);

  const [listChecked, setListChecked] = useState(
    order?.orderItems.map((item) => item.product)
  );
  // console.log('listChecked:', listChecked);
  const [isOpenModalUpdateAddress, setIsOpenModalUpdateAddress] =
    useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: "",
    phone: "",
    address: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, orderItem, value) => {
    const idProduct = orderItem.product;
    switch (type) {
      case "increase":
        if (orderItem?.quantity >= orderItem.quantityInStock) {
          message.error(`Chỉ còn ${orderItem.quantityInStock} sản phẩm`);
        } else {
          dispatch(increaseAmount({ idProduct, userId: user.id }));
        }
        break;
      case "decrease":
        if (orderItem?.quantity <= 1) {
          message.error("Số lượng phải lớn hơn 1");
        } else {
          dispatch(decreaseAmount({ idProduct, userId: user.id }));
        }
        break;
      default:
        if (Number.isNaN(value)) {
          message.error("Mời điền số");
        } else if (value < 1) {
          message.error("Số lượng phải lớn hơn 1");
        } else if (value > orderItem.quantityInStock) {
          message.error(`Chỉ còn ${orderItem.quantityInStock} sản phẩm`);
          value = orderItem.quantityInStock;
          dispatch(changeAmount({ idProduct, value, userId: user.id }));
        } else {
          dispatch(changeAmount({ idProduct, value, userId: user.id }));
        }
        break;
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderItem({ idProduct, userId: user.id }));
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrderItem({ listChecked, userId: user.id }));
  }, [listChecked]);

  useEffect(() => {
    form.setFieldsValue(shippingAddress);
  }, [form, shippingAddress]);

  useEffect(() => {
    if (isOpenModalUpdateAddress) {
      setShippingAddress({
        recipientName: order?.shippingAddress?.recipientName ?? user?.name,
        address: order?.shippingAddress?.address ?? user?.address,
        phone: order?.shippingAddress?.phone ?? user?.phone,
      });
    }
  }, [isOpenModalUpdateAddress]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateAddress(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return (
        total + (cur.price - (cur.price * cur.discount) / 100) * cur.quantity
      );
    }, 0);
    return result;
  }, [order]);
  // console.log("priceMemo:", priceMemo);

  // lấy shipping price từ db
  const getShippingPrice = async () => {
    // console.log("priceMemo in function:", priceMemo);
    if (priceMemo > 0) {
      const res = await ShippingPriceService.getShippingPrice({
        price: priceMemo,
      });
      // console.log("res:", res);
      if (res?.status === "OK") return res?.data;
      else {
        message.error(res.message);
        console.error(res.message);
        return {
          shippingFee: 0,
        };
      }
    } else {
      return {
        shippingFee: 0,
      };
    }
  };

  const {
    data: shippingPrice,
    isPending: isPendingShippingPrice,
    refetch: refetchShippingPrice,
  } = useQuery({
    queryKey: ["shipping price"],
    queryFn: getShippingPrice,
  });
  // console.log("shippingPrice:", shippingPrice);
  // console.log("isPendingShippingPrice:", isPendingShippingPrice);

  useEffect(() => {
    if (priceMemo) {
      // Khi priceMemo thay đổi, gọi query để lấy shipping price
      refetchShippingPrice();
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    if (priceMemo)
      return Number(priceMemo) + Number(shippingPrice?.shippingFee);
    else return 0;
  }, [priceMemo, shippingPrice?.shippingFee]);

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 1) {
      dispatch(removeAllOrderItem({ listChecked, userId: user.id }));
    }
  };

  const handleAddCard = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (
      !order?.shippingAddress?.phone ||
      !order?.shippingAddress.address ||
      !order?.shippingAddress.recipientName
    ) {
      setIsOpenModalUpdateAddress(true);
    } else {
      dispatch(
        updateOrder({
          userId: user?.id,
          itemsPrice: priceMemo,
          shippingFee: shippingPrice?.shippingFee,
          shippingPrice: shippingPrice?._id,
          totalPrice: totalPriceMemo,
        })
      );
      navigate("/payment");
    }
  };

  const handleCancelUpdate = () => {
    setShippingAddress({
      recipientName: "",
      email: "",
      phone: "",
    });
    form.resetFields();
    setIsOpenModalUpdateAddress(false);
  };

  const handleOnchangeDetails = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateShippingAddress = () => {
    const { recipientName, address, phone } = shippingAddress;
    if (recipientName && address && phone) {
      dispatch(
        updateShippingAddress({
          recipientName,
          address,
          phone,
          userId: user.id,
        })
      );
    }
    setIsOpenModalUpdateAddress(false);
  };

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h2 style={{ padding: "10px 0" }}>Giỏ hàng</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length}
                ></CustomCheckbox>
                <span style={{ marginLeft: "15px" }}>
                  {" "}
                  Tất cả ({order?.orderItems?.length} sản phẩm)
                </span>
              </span>
              <WrapperItemPrice>
                <span>Đơn giá</span>
                <span>Giảm giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleRemoveAllOrder}
                />
              </WrapperItemPrice>
            </WrapperStyleHeader>
            <div>
              {order?.orderItems?.map((orderItem) => {
                return (
                  <WrapperItemOrder key={orderItem?.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <CustomCheckbox
                        onChange={onChange}
                        value={orderItem?.product}
                        checked={listChecked.includes(orderItem?.product)}
                      ></CustomCheckbox>
                      <img
                        src={orderItem?.image}
                        alt=""
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          textWrap: "wrap",
                        }}
                      >
                        {orderItem?.name}
                      </div>
                    </div>
                    <WrapperItemPrice>
                      <span style={{ fontSize: "13px", color: "#242424" }}>
                        {convertPrice(orderItem?.price)}
                      </span>
                      <span style={{ fontSize: "13px", color: "#242424" }}>
                        {convertPrice(
                          ((orderItem?.price * orderItem?.discount) / 100) *
                            orderItem?.quantity
                        )}
                        &nbsp;&#40;
                        <span style={{ color: "rgb(0, 171, 86)" }}>
                          {orderItem?.discount}%
                        </span>
                        &#41;
                      </span>
                      <div>
                        <WrapperCountOrder>
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount("decrease", orderItem)
                            }
                          >
                            <MinusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          </button>
                          <WrapperInputNumber
                            type="number"
                            defaultValue={orderItem?.quantity}
                            value={orderItem?.quantity}
                            size="small"
                            min={1}
                            max={orderItem?.quantityInStock}
                            onPressEnter={(e) =>
                              handleChangeCount(
                                "value",
                                orderItem,
                                Number(e.target.value)
                              )
                            }
                          />
                          <button
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleChangeCount("increase", orderItem)
                            }
                          >
                            <PlusOutlined
                              style={{ color: "#000", fontSize: "10px" }}
                            />
                          </button>
                        </WrapperCountOrder>
                        {orderItem?.quantityInStock <= 5 && (
                          <WrapperLimitOrder>
                            Còn: {orderItem?.quantityInStock} sản phẩm
                          </WrapperLimitOrder>
                        )}
                      </div>
                      <span
                        style={{
                          color: "rgb(255, 66, 78)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {convertPrice(
                          (orderItem?.price -
                            (orderItem?.price * orderItem.discount) / 100) *
                            orderItem?.quantity
                        )}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(orderItem?.product)}
                      />
                    </WrapperItemPrice>
                  </WrapperItemOrder>
                );
              })}
            </div>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {order?.shippingAddress.address ?? user?.address}{" "}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "var(--primary-color)", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>
              <WrapperInfoBody>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Tạm tính</span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Phí giao hàng</span>
                  <Loading isPending={isPendingShippingPrice}>
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {priceMemo
                        ? convertPrice(shippingPrice?.shippingFee)
                        : "0đ"}
                    </span>
                  </Loading>
                </div>
              </WrapperInfoBody>
              <WrapperTotal>
                <span>Tổng giá</span>
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      color: "rgb(254, 56, 52)",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    {totalPriceMemo ? (
                      convertPrice(totalPriceMemo)
                    ) : (
                      <div style={{ fontSize: "16px" }}>
                        Vui lòng chọn sản phẩm
                      </div>
                    )}
                  </span>
                </span>
              </WrapperTotal>
            </div>
            <ButtonComponent
              onClick={() => handleAddCard()}
              size={40}
              buttonStyle={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "320px",
                border: "none",
                borderRadius: "4px",
              }}
              buttonText={"Mua hàng"}
              buttonTextStyle={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
              disabled={
                user?.role !== "Khách hàng" ||
                isPendingShippingPrice ||
                !totalPriceMemo
              }
            />
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateAddress}
        onCancel={handleCancelUpdate}
        onOk={() => form.submit()}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleUpdateShippingAddress}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="Tên người nhận"
            name="recipientName"
            rules={[{ required: true, message: "Mời nhập tên người nhận!" }]}
          >
            <InputComponent
              value={shippingAddress.recipientName}
              onChange={handleOnchangeDetails}
              name="recipientName"
            />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Mời nhập số điện thoại!" }]}
          >
            <InputComponent
              value={shippingAddress.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Mời nhập địa chỉ!" }]}
          >
            <InputComponent
              value={shippingAddress.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>
        </Form>
      </ModalComponent>
    </div>
  );
};

export default CartPage;
