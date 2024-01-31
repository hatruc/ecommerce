import React, { useEffect, useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
  WrapperCurrentStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";

const MyOrderPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fetchMyOrder = async () => {
    const res = await OrderService.getAllUserOrders(user?.id, user?.access_token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!(user?.id && user?.access_token),
  });
  const { isPending, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/order-details/${id}`);
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      {
        id: order._id,
        token: user?.access_token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isPending: isPendingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancel,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success("Hủy thành công");
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancel) {
      message.error();
    }
  }, [isErrorCancel, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((item) => {
      return (
        <WrapperHeaderItem key={item?._id}>
          <img
            src={item?.image}
            alt="ảnh sản phẩm"
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div
            style={{
              width: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              textWrap: "wrap",
              marginLeft: "10px",
            }}
          >
            {item?.name}
          </div>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            Đơn giá: {convertPrice(item?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <Loading isPending={isPending || isPendingCancel}>
      <WrapperContainer>
        <div
          style={{
            minHeight: "90vh",
            height: "100%",
            width: "1270px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ padding: "10px 0" }}>Đơn hàng của tôi</h2>
          <WrapperListOrder>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Trạng thái:{" "}
                      <WrapperCurrentStatus>
                        {order?.currentStatus}
                      </WrapperCurrentStatus>
                    </span>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Tổng giá:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(56, 56, 61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        buttonStyle={{
                          height: "36px",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "4px",
                        }}
                        buttonText={"Hủy đặt hàng"}
                        buttonTextStyle={{ color: "var(--primary-color)", fontSize: "14px" }}
                        disabled={order?.currentStatus !== "Chờ xử lý"}
                      />
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        buttonStyle={{
                          height: "36px",
                          border: "1px solid var(--primary-color)",
                          borderRadius: "4px",
                        }}
                        buttonText={"Xem chi tiết"}
                        buttonTextStyle={{ color: "var(--primary-color)", fontSize: "14px" }}
                      />
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              );
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
