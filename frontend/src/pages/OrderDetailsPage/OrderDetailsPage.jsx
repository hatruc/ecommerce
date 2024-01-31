import React, { useEffect, useState } from "react";
import {
  WrapperAllPrice,
  WrapperButtonGroup,
  WrapperContentInfo,
  WrapperCurrentStatus,
  WrapperHeaderUser,
  WrapperInfo,
  WrapperItem,
  WrapperItemLabel,
  WrapperItemOrder,
  WrapperItemPrice,
  WrapperLabel,
  WrapperStyleContent,
  WrapperStyleHeader,
  WrapperUpdateHistory,
} from "./style";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as message from "../../components/Message/Message";
import * as OrderService from "../../services/OrderService";
import * as UserService from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import { orderConstant } from "../../constant";
import { convertPrice } from "../../utils";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Select } from "antd";
import { useMutationHooks } from "../../hooks/useMutationHook";

const OrderDetailsPage = () => {
  const params = useParams();
  const id = params.id;
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // console.log(user);

  const getDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(
      id,
      token || user?.access_token
    );
    return res.data;
  };

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, user?.access_token);
    if (user?.role === "Admin" || user?.role === "Nhân viên") {
      // Use Promise.all to asynchronously fetch details for each user
      const updateHistoryWithUserDetails = await Promise.all(
        res.data.updateHistory?.map(async (item) => {
          if (user && user.access_token) {
            item.updater = await getDetailsUser(
              item.updater,
              user.access_token
            );
          }
          return item;
        })
      );

      res.data.updateHistory = updateHistoryWithUserDetails;
    }
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["order-details"],
    queryFn: fetchDetailsOrder,
  });
  const { isPending, data: order, refetch: refetchOrder } = queryOrder;
  // console.log("order:", order);

  const [orderStatus, setOrderStatus] = useState(order?.currentStatus);
  // console.log("orderStatus:", orderStatus);

  useEffect(() => {
    setOrderStatus(order?.currentStatus);
  }, [order?.currentStatus]);

  const handleChangeStatus = (value) => setOrderStatus(value);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.updateStatus(id, { ...rests }, token);
    return res;
  });

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
  } = mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật trạng thái thành công");
      refetchOrder();
    } else {
      if (dataUpdated?.message) {
        message.error(dataUpdated?.message);
      }
    }
  }, [isSuccessUpdated]);

  const handleUpdateStatus = () => {
    const data = {
      status: orderStatus,
      updater: user?.id,
      updatedAt: new Date(),
    };
    if (order?.currentStatus !== orderStatus)
      mutationUpdate.mutate({ id: id, token: user?.access_token, ...data });
    else message.warning("Mời chọn trạng thái mới");
  };

  const handleCancel = () => {
    if (location?.state) {
      navigate(location?.state);
    }
  }

  return (
    <Loading isPending={isPending || isPendingUpdated}>
      <div style={{ width: "100%", background: "#f5f5fa" }}>
        <div
          style={{ width: "1270px", margin: "0 auto", paddingBottom: "50px" }}
        >
          <h2 style={{ padding: "10px 0" }}>Chi tiết đơn hàng</h2>
          <WrapperHeaderUser>
            <WrapperInfo>
              <WrapperLabel>Thông tin giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  <span>Tên người nhận: </span>{" "}
                  {order?.shippingAddress?.recipientName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span> {order?.shippingAddress?.address}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span> {order?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfo>
            <WrapperInfo>
              <WrapperLabel>Trạng thái</WrapperLabel>
              <WrapperContentInfo>
                <div className="status-info">
                  <WrapperCurrentStatus>
                    {order?.currentStatus}
                  </WrapperCurrentStatus>
                </div>
              </WrapperContentInfo>
            </WrapperInfo>
            <WrapperInfo>
              <WrapperLabel>Phương thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderConstant.payment[order?.paymentMethod]}
                </div>
              </WrapperContentInfo>
            </WrapperInfo>
          </WrapperHeaderUser>

          <WrapperStyleContent>
            <WrapperStyleHeader>
              <span
                style={{
                  display: "inline-block",
                  width: "300px",
                  textAlign: "center",
                }}
              >
                <span>Sản phẩm</span>
              </span>
              <WrapperItemPrice>
                <span>Đơn giá</span>
                <span>Giảm giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </WrapperItemPrice>
            </WrapperStyleHeader>
            <div>
              {order?.orderItems?.map((orderItem) => {
                return (
                  <WrapperItemOrder key={orderItem?.product}>
                    <div
                      style={{
                        width: "300px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
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
                          width: 200,
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
                      <div>{orderItem?.quantity}</div>
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
                    </WrapperItemPrice>
                  </WrapperItemOrder>
                );
              })}
            </div>
            <WrapperAllPrice>
              <WrapperItemLabel>Tạm tính</WrapperItemLabel>
              <WrapperItem>{convertPrice(order?.itemsPrice)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Phí giao hàng</WrapperItemLabel>
              <WrapperItem>{convertPrice(order?.shippingFee)}</WrapperItem>
            </WrapperAllPrice>
            <WrapperAllPrice>
              <WrapperItemLabel>Tổng cộng</WrapperItemLabel>
              <WrapperItem>
                <WrapperItem>{convertPrice(order?.totalPrice)}</WrapperItem>
              </WrapperItem>
            </WrapperAllPrice>
          </WrapperStyleContent>
          {(user?.role === "Admin" || user?.role === "Nhân viên") && (
            <>
              <WrapperStyleContent>
                <WrapperInfo>
                  <WrapperLabel>Lịch sử cập nhật</WrapperLabel>
                  <WrapperContentInfo>
                    <WrapperStyleHeader>
                      <WrapperItemPrice>
                        <span>Trạng thái</span>
                        <span>Người cập nhật</span>
                        <span>Ngày cập nhật</span>
                      </WrapperItemPrice>
                    </WrapperStyleHeader>
                    <WrapperUpdateHistory>
                      {order?.updateHistory?.map((item) => {
                        return (
                          <WrapperItemOrder key={item?.updatedAt}>
                            <WrapperItemPrice>
                              <WrapperCurrentStatus>
                                {item?.status}
                              </WrapperCurrentStatus>
                              <span
                                style={{ fontSize: "13px", color: "#242424" }}
                              >
                                {item?.updater?.name || item?.updater?.email}
                              </span>
                              <span>
                                {new Date(item?.updatedAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            </WrapperItemPrice>
                          </WrapperItemOrder>
                        );
                      })}
                    </WrapperUpdateHistory>
                  </WrapperContentInfo>
                </WrapperInfo>
              </WrapperStyleContent>

              <WrapperStyleContent>
                <Select
                  value={orderStatus}
                  onChange={handleChangeStatus}
                  placeholder="Thay đổi trạng thái"
                >
                  <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
                  <Select.Option value="Đang giao">Đang giao</Select.Option>
                  <Select.Option value="Đã giao">Đã giao</Select.Option>
                </Select>
                <WrapperButtonGroup>
                  <ButtonComponent
                    type="primary"
                    buttonStyle={{
                      marginBottom: "10px",
                      cursor: "pointer",
                      width: "fit-content",
                      border: "none",
                    }}
                    buttonTextStyle={{
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                    onClick={handleUpdateStatus}
                    buttonText="Cập nhật trạng thái"
                  />
                  <ButtonComponent
                    onClick={handleCancel}
                    buttonStyle={{
                      height: "36px",
                      border: "1px solid var(--primary-color)",
                      borderRadius: "4px",
                    }}
                    buttonText={"Hủy"}
                    buttonTextStyle={{
                      color: "var(--primary-color)",
                      fontSize: "14px",
                    }}
                  />
                </WrapperButtonGroup>
              </WrapperStyleContent>
            </>
          )}
        </div>
      </div>
    </Loading>
  );
};

export default OrderDetailsPage;
