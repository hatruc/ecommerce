import { Button, Form, Space } from "antd";
import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ShippingPriceService from "../../services/ShippingPriceService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";
import { convertPrice, validateNumber } from "../../utils";

const AdminShippingPrice = () => {
  const queryClient = useQueryClient();
  const [rowSelected, setRowSelected] = useState("");
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDeleteMany, setIsOpenModalDeleteMany] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);

  const [stateShippingPrice, setStateShippingPrice] = useState({
    maxOrderAmount: "",
    shippingFee: "",
  });

  // lấy tất cả shipping price từ db
  const getAllShippingPrices = async () => {
    const res = await ShippingPriceService.getAllShippingPrices(
      user?.access_token
    );
    return res?.data;
  };

  const { data: shippingPrices, isPending: isPendingShippingPrices } = useQuery(
    {
      queryKey: ["shipping prices"],
      queryFn: getAllShippingPrices,
    }
  );

  // table
  const dataTable =
    shippingPrices?.length > 0 &&
    shippingPrices?.map((shippingPrice) => {
      return {
        ...shippingPrice,
        maxOrderAmount: shippingPrice.maxOrderAmount
          ? convertPrice(shippingPrice.maxOrderAmount)
          : "MAX",
        shippingFee: convertPrice(shippingPrice.shippingFee),
        key: shippingPrice._id,
      };
    });

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
            setIsOpenModalUpdate(true);
          }}
          buttonText="Sửa"
        />
        <ButtonComponent
          buttonStyle={{
            background: "red",
            cursor: "pointer",
            width: "fit-content",
            border: "none",
            marginLeft: "10px",
          }}
          buttonTextStyle={{
            color: "#fff",
            fontWeight: "bold",
          }}
          onClick={() => setIsOpenModalDelete(true)}
          buttonText="Xóa"
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Mức giá tối đa",
      dataIndex: "maxOrderAmount",
      sorter: (a, b) => b.maxOrderAmount - a.maxOrderAmount,
      ...getColumnSearchProps("maxOrderAmount"),
    },
    {
      title: "Phí giao hàng",
      dataIndex: "shippingFee",
      sorter: (a, b) => b.shippingFee - a.shippingFee,
      ...getColumnSearchProps("shippingFee"),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  // reset state khi bấm nút tạo
  useEffect(() => {
    if (isOpenModalCreate) {
      setStateShippingPrice({
        maxOrderAmount: "",
        shippingFee: "",
      });
    }
  }, [isOpenModalCreate]);

  // lấy details shipping price khi bấm nút sửa
  useEffect(() => {
    if (rowSelected && isOpenModalUpdate) {
      setIsPendingUpdate(true);
      fetchGetDetailsShippingPrice(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenModalUpdate]);

  const fetchGetDetailsShippingPrice = async (rowSelected, access_token) => {
    const res = await ShippingPriceService.getDetailsShippingPrice(
      rowSelected,
      access_token
    );
    if (res?.data) {
      setStateShippingPrice({
        maxOrderAmount: res?.data?.maxOrderAmount,
        shippingFee: res?.data?.shippingFee,
      });
    }
    setIsPendingUpdate(false);
  };

  // form chi tiết phí ship
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(stateShippingPrice);
  }, [form, stateShippingPrice]);

  const handleOnchangeDetails = (e) => {
    setStateShippingPrice({
      ...stateShippingPrice,
      [e.target.name]: e.target.value,
    });
  };


  // call api thêm sửa, xóa
  const mutationCreate = useMutationHooks((data) => {
    const { token, ...rests } = data;
    // console.log(data);
    const res = ShippingPriceService.createShippingPrice({ ...rests }, token);
    // console.log(res);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = ShippingPriceService.updateShippingPrice(
      id,
      { ...rests },
      token
    );
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    // console.log(data);
    const res = ShippingPriceService.deleteShippingPrice(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ShippingPriceService.deleteManyShippingPrices(ids, token);
    return res;
  });

  const {
    data: dataCreated,
    isPending: isPendingCreated,
    isSuccess: isSuccessCreated,
  } = mutationCreate;

  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
  } = mutationDeleted;

  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
  } = mutationDeletedMany;

  useEffect(() => {
    if (isSuccessCreated && dataCreated?.status === "OK") {
      message.success();
      handleCloseModalCreate();
    } else {
      if (dataCreated?.message) {
        message.error(dataCreated?.message);
      }
    }
  }, [isSuccessCreated]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseModalUpdate();
    } else {
      if (dataUpdated?.message) {
        message.error(dataUpdated?.message);
      }
    }
  }, [isSuccessUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success();
      handleCloseModalDelete();
    } else {
      if (dataDeleted?.message) {
        message.error(dataDeleted?.message);
      }
    }
  }, [isSuccessDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success();
      handleCloseModalDeleteMany();
    } else {
      if (dataDeletedMany?.message) {
        message.error(dataDeletedMany?.message);
      }
    }
  }, [isSuccessDeletedMany]);

  const handleCreateShippingPrice = () => {
    mutationCreate.mutate(
      { token: user?.access_token, ...stateShippingPrice },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["shipping prices"]);
        },
      }
    );
  };

  const handleCloseModalCreate = () => {
    setIsOpenModalCreate(false);
    setStateShippingPrice({
      maxOrderAmount: "",
      shippingFee: "",
    });
    form.resetFields();
  };

  const handleUpdateShippingPrice = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateShippingPrice,
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["shipping prices"]);
        },
      }
    );
  };

  const handleCloseModalUpdate = () => {
    setIsOpenModalUpdate(false);
    setStateShippingPrice({
      maxOrderAmount: "",
      shippingFee: "",
    });
    form.resetFields();
  };

  const handleCloseModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteShippingPrice = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["shipping prices"]);
        },
      }
    );
  };

  const handleCloseModalDeleteMany = () => {
    setIsOpenModalDeleteMany(false);
  };

  const handleDeleteManyShippingPrices = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["shipping prices"]);
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý phí giao hàng</WrapperHeader>

      <div style={{ marginTop: "20px" }}>
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
          onClick={() => {
            setIsOpenModalCreate(true);
          }}
          buttonText="Tạo"
        />

        {!!rowSelectedKeys.length && (
          <ButtonComponent
            type="primary"
            buttonStyle={{
              background: "red",
              marginLeft: "10px",
              marginBottom: "10px",
              cursor: "pointer",
              width: "fit-content",
              border: "none",
            }}
            buttonTextStyle={{
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={() => {
              setIsOpenModalDeleteMany(true);
            }}
            buttonText="Xóa tất cả"
          />
        )}

        <TableComponent
          columns={columns}
          isPending={isPendingShippingPrices}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setRowSelected(record._id);
              },
            };
          }}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              setRowSelectedKeys(selectedRowKeys);
            },
          }}
        />

        <div>
          Lưu ý: Phí giao hàng áp dụng cho khoảng từ mức giá nhỏ hơn gần nhất
          đến mức giá hiện tại.
          <br />
          Ví dụ có 3 phí giao hàng:
          <br />
          MAX-0đ
          <br />
          1.000.000đ-30.000đ
          <br />
          500.000đ-20.000đ
          <br />
          Nghĩa là:
          <br />
          Hóa đơn từ 0--{">"} nhỏ hơn 500.000đ có phí giao hàng là 20.000đ
          <br />
          Hóa đơn từ 500.000đ--{">"} nhỏ hơn 1.000.000đ có phí giao hàng là
          30.000đ
          <br />
          Hóa đơn từ 1.000.000đ trở lên có phí giao hàng là 0đ
          <br />
          Mức giá tối đa để trống tương đương với MAX
        </div>
      </div>

      <ModalComponent
        title={
          isOpenModalCreate ? "Tạo mới phí giao hàng" : "Sửa phí giao hàng"
        }
        isOpen={isOpenModalCreate || isOpenModalUpdate}
        onCancel={() => {
          setIsOpenModalUpdate(false);
          setIsOpenModalCreate(false);
        }}
        onOk={() => form.submit()}
      >
        <Loading
          isPending={isPendingUpdate || isPendingUpdated || isPendingCreated}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 19 }}
            autoComplete="on"
            form={form}
            onFinish={
              isOpenModalCreate
                ? handleCreateShippingPrice
                : handleUpdateShippingPrice
            }
          >
            <Form.Item
              label="Mức giá tối đa (đ)"
              name="maxOrderAmount"
              rules={[
                {
                  validator: validateNumber,
                  required: true,
                },
              ]}
            >
              <InputComponent
                value={stateShippingPrice.maxOrderAmount}
                onChange={handleOnchangeDetails}
                name="maxOrderAmount"
              />
            </Form.Item>

            <Form.Item
              label="Phí giao hàng (đ)"
              name="shippingFee"
              rules={[
                { required: true, message: "Mời nhập phí giao hàng!" },
                {
                  validator: validateNumber,
                },
              ]}
            >
              <InputComponent
                value={stateShippingPrice.shippingFee}
                onChange={handleOnchangeDetails}
                name="shippingFee"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa phí giao hàng"
        open={isOpenModalDelete}
        onCancel={handleCloseModalDelete}
        onOk={handleDeleteShippingPrice}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa phí giao hàng này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa tất cả phí giao hàng đã chọn"
        open={isOpenModalDeleteMany}
        onCancel={handleCloseModalDeleteMany}
        onOk={handleDeleteManyShippingPrices}
      >
        <Loading isPending={isPendingDeletedMany}>
          <div>Bạn có chắc muốn xóa tất cả phí giao hàng đã chọn không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminShippingPrice;
