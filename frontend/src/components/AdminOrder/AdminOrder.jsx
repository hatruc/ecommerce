import { Button, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { WrapperCurrentStatus, WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import { convertPrice } from "../../utils";

import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { orderConstant } from "../../constant";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";

const AdminOrder = () => {
  const user = useSelector((state) => state?.user);
  const [rowSelected, setRowSelected] = useState("");
  const searchInput = useRef(null);
  const [navigateOrderDetails, setNavigateOrderDetails] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getDetailsUser = async (id) => {
    const res = await UserService.getDetailsUser(id, user.access_token);
    return res.data;
  };

  const getAllOrders = async () => {
    const res = await OrderService.getAllOrders(user?.access_token);
    // Use Promise.all to asynchronously fetch details for each user
    const ordersWithUserDetails = await Promise.all(
      res.data.map(async (order) => {
        order.user = await getDetailsUser(order.user, user?.access_token);
        return order;
      })
    );

    return ordersWithUserDetails;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrders });
  const { data: orders, isPending: isPendingOrders } = queryOrder;
  // console.log(orders);

  // search dropdown
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch(selectedKeys, confirm, dataIndex);
            }}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const renderAction = () => {
    return (
      <div>
        <ButtonComponent
          buttonStyle={{
            background: "orange",
            cursor: "pointer",
            width: "fit-content",
            border: "none",
          }}
          buttonTextStyle={{
            color: "#fff",
            fontWeight: "bold",
          }}
          onClick={() => {
            setNavigateOrderDetails(true);
          }}
          buttonText="Sửa"
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      sorter: (a, b) => a.userName - b.userName,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Trạng thái",
      dataIndex: "currentStatus",
      sorter: (a, b) => a.userName - b.userName,
      ...getColumnSearchProps("currentStatus"),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      sorter: (a, b) => a.paymentMethod - b.paymentMethod,
      ...getColumnSearchProps("paymentMethod"),
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      ...getColumnSearchProps("totalPrice"),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    orders?.length &&
    orders?.map((order) => {
      // console.log("order", order);
      return {
        ...order,
        key: order?._id,
        currentStatus: (
          <WrapperCurrentStatus>{order?.currentStatus}</WrapperCurrentStatus>
        ),
        userName: order?.user?.name || order?.user?.email, // first truthy value or the last falsy value
        paymentMethod: orderConstant.payment[order?.paymentMethod],
        totalPrice: convertPrice(order?.totalPrice),
      };
    });

  useEffect(() => {
    if (navigateOrderDetails) {
      navigate(`/order-details/${rowSelected}`, { state: location?.pathname });
    }
  }, [rowSelected, navigateOrderDetails]);

  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <Loading isPending={isPendingOrders}>
          <TableComponent
            columns={columns}
            isPending={isPendingOrders}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: () => {
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </Loading>
      </div>
    </div>
  );
};

export default AdminOrder;
