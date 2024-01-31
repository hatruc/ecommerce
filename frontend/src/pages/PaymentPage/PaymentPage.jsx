import { Form, Radio } from "antd";
import React, { useEffect, useState } from "react";
import {
  Label,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
} from "./style";
import { orderConstant } from "../../constant";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { useNavigate } from "react-router-dom";
import {
  removeAllOrderItem,
  updateShippingAddress,
} from "../../redux/slices/OrderSlice";

const PaymentPage = () => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) =>
    state.orders?.find((order) => order.user === user.id)
  );
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const navigate = useNavigate();

  const [isOpenModalUpdateAddress, setIsOpenModalUpdateAddress] =
    useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: "",
    phone: "",
    address: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

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

  const handleAddOrder = () => {
    // console.log("user:", user);
    // console.log("order:", order);
    // console.log("paymentMethod:", paymentMethod);
    // console.log(user?.access_token,
    //   order?.orderItemsSelected,
    //   order?.shippingAddress.recipientName,
    //   order?.shippingAddress.address,
    //   order?.shippingAddress.phone,
    //   paymentMethod,
    //   order?.itemsPrice,
    //   order?.shippingFee,
    //   order?.shippingPrice,
    //   order?.totalPrice,
    //   order?.user);

    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      order?.shippingAddress.recipientName &&
      order?.shippingAddress.address &&
      order?.shippingAddress.phone &&
      paymentMethod &&
      order?.itemsPrice &&
      order?.shippingFee &&
      order?.shippingPrice &&
      order?.totalPrice &&
      order?.user
    ) {
      // eslint-disable-next-line no-unused-expressions
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        recipientName: order?.shippingAddress.recipientName,
        address: order?.shippingAddress.address,
        phone: order?.shippingAddress.phone,
        paymentMethod: paymentMethod,
        itemsPrice: order?.itemsPrice,
        shippingFee: order?.shippingFee,
        shippingPrice: order?.shippingPrice,
        totalPrice: order?.totalPrice,
        user: order?.user,
      });
    } else {
      message.error("Thiếu thông tin order");
      console.log(
        !!user?.access_token,
        !!order?.orderItemsSelected,
        !!order?.shippingAddress.recipientName,
        !!order?.shippingAddress.address,
        !!order?.shippingAddress.phone,
        !!paymentMethod,
        !!order?.itemsPrice,
        !!order?.shippingFee,
        !!order?.shippingPrice,
        !!order?.totalPrice,
        !!order?.user
      );
    }
  };

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const {
    data: dataAdded,
    isPending: isPendingAddOrder,
    isSuccess,
    isError,
  } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdded?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });
      dispatch(
        removeAllOrderItem({ listChecked: arrayOrdered, userId: user.id })
      );
      message.success("Đặt hàng thành công");
      // console.log(dataAdded);
      navigate(`/order-details/${dataAdded.data._id}`);
    } else if (dataAdded?.status === "ERR") {
      console.log(dataAdded?.message);
      message.error(dataAdded?.message);
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleCancelUpdate = () => {
    setShippingAddress({
      recipientName: "",
      email: "",
      phone: "",
    });
    form.resetFields();
    setIsOpenModalUpdateAddress(false);
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

  const handleOnchangeDetails = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePayment = (e) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Loading isPending={isPendingAddOrder}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h2 style={{ padding: "10px 0" }}>Thanh toán</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperLeft>
              <WrapperInfo>
                <Label>Chọn phương thức thanh toán</Label>
                <WrapperRadio
                  onChange={handleChangePayment}
                  value={paymentMethod}
                >
                  <Radio value="cash_on_delivery">
                    {" " + orderConstant.payment["cash_on_delivery"]}
                  </Radio>
                  <Radio value="online">
                    {" " + orderConstant.payment["online"]}
                  </Radio>
                </WrapperRadio>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: "bold" }}>
                      {order?.shippingAddress?.address + " "}
                    </span>
                    <span
                      onClick={handleChangeAddress}
                      style={{
                        color: "var(--primary-color)",
                        cursor: "pointer",
                      }}
                    >
                      Thay đổi
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
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
                      {convertPrice(order.itemsPrice)}
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
                    <span
                      style={{
                        color: "#000",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(order.shippingFee)}
                    </span>
                  </div>
                </WrapperInfo>
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
                      {convertPrice(order.totalPrice)}
                    </span>
                  </span>
                </WrapperTotal>
              </div>

              <ButtonComponent
                onClick={() => handleAddOrder()}
                size={40}
                buttonStyle={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "320px",
                  border: "none",
                  borderRadius: "4px",
                }}
                buttonText={"Đặt hàng"}
                buttonTextStyle={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              ></ButtonComponent>
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
      </Loading>
    </div>
  );
};

export default PaymentPage;
