import { Button, Form, Select, Space } from "antd";
import React, { useRef } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons"

const AdminUser = () => {
  const queryClient = useQueryClient();
  const [rowSelected, setRowSelected] = useState("");
  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isOpenModalCreate, setIsOpenModalCreate] = useState(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDeleteMany, setIsOpenModalDeleteMany] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef();

  const [stateUser, setStateUser] = useState({
    email: "",
    password: "",
    role: "",
    name: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    avatar: "",
  });

  // lấy tất cả user từ db
  const getAllUsers = async () => {
    const res = await UserService.getAllUsers(user?.access_token);
    return res?.data;
  };

  const { data: users, isPending: isPendingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // table
  const dataTable =
    users?.length > 0 &&
    users?.map((user) => {
      return { ...user, key: user._id };
    });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

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
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps("address"),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      sorter: (a, b) => a.role.length - b.role.length,
      ...getColumnSearchProps("role"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
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
      setStateUser({
        email: "",
        password: "",
        role: "",
        name: "",
        dateOfBirth: "",
        phone: "",
        address: "",
        avatar: "",
      });
    }
  }, [isOpenModalCreate]);

  // lấy details user khi bấm nút sửa
  useEffect(() => {
    if (rowSelected && isOpenModalUpdate) {
      setIsPendingUpdate(true);
      fetchGetDetailsUser(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenModalUpdate]);

  const fetchGetDetailsUser = async (rowSelected, access_token) => {
    const res = await UserService.getDetailsUser(rowSelected, access_token);
    if (res?.data) {
      setStateUser({
        email: res?.data?.email,
        password: res?.data?.password,
        role: res?.data?.role,
        name: res?.data?.name,
        dateOfBirth: res?.data?.dateOfBirth,
        phone: res?.data?.phone,
        address: res?.data?.address,
        avatar: res.data?.avatar,
      });
    }
    setIsPendingUpdate(false);
  };

  // form chi tiết người dùng
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(stateUser);
  }, [form, stateUser]);

  const handleOnchangeDetails = (e) => {
    setStateUser({
      ...stateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUser({
      ...stateUser,
      avatar: file.preview,
    });
  };

  // call api thêm sửa, xóa
  const mutationCreate = useMutationHooks((data) => {
    const { token, ...rests } = data;
    // console.log(data);
    const res = UserService.createUser({ ...rests }, token);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, email, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    // console.log(data);
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUsers(ids, token);
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

  const handleCreateUser = () => {
    mutationCreate.mutate(
      { token: user?.access_token, ...stateUser },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["users"]);
        },
      }
    );
  };

  const handleCloseModalCreate = () => {
    setIsOpenModalCreate(false);
    setStateUser({
      email: "",
      password: "",
      role: "",
      name: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      avatar: "",
    });
    form.resetFields();
  };

  const handleUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUser },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["users"]);
        },
      }
    );
  };

  const handleCloseModalUpdate = () => {
    setIsOpenModalUpdate(false);
    setStateUser({
      email: "",
      password: "",
      role: "",
      name: "",
      dateOfBirth: "",
      phone: "",
      address: "",
      avatar: "",
    });
    form.resetFields();
  };

  const handleCloseModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["users"]);
        },
      }
    );
  };

  const handleCloseModalDeleteMany = () => {
    setIsOpenModalDeleteMany(false);
  };

  const handleDeleteManyUsers = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["users"]);
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý người dùng</WrapperHeader>

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
          isPending={isPendingUsers}
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
      </div>

      <ModalComponent
        title={isOpenModalCreate ? "Tạo mới người dùng" : "Sửa người dùng"}
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
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            autoComplete="on"
            form={form}
            onFinish={isOpenModalCreate ? handleCreateUser : handleUpdateUser}
          >
            {isOpenModalCreate ? (
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Mời nhập email!" }]}
              >
                <InputComponent
                  value={stateUser.email}
                  onChange={handleOnchangeDetails}
                  name="email"
                />
              </Form.Item>
            ) : (
              <Form.Item label="Email">{stateUser.email}</Form.Item>
            )}

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Mời nhập mật khẩu!" }]}
            >
              <InputComponent
                value={stateUser.password}
                onChange={handleOnchangeDetails}
                name="password"
              />
            </Form.Item>

            <Form.Item
              label="Vai trò"
              name="role"
              rules={[{ required: true, message: "Mời chọn vai trò!" }]}
            >
              <Select
                value={stateUser.role}
                onChange={(value) =>
                  handleOnchangeDetails({ target: { name: "role", value } })
                }
                placeholder="Chọn vai trò"
              >
                <Select.Option value="Khách hàng">Khách hàng</Select.Option>
                <Select.Option value="Admin">Admin</Select.Option>
                <Select.Option value="Nhân viên">Nhân viên</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tên" name="name">
              <InputComponent
                value={stateUser.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dateOfBirth">
              <InputComponent
                value={stateUser.dateOfBirth}
                onChange={handleOnchangeDetails}
                name="dateOfBirth"
              />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <InputComponent
                value={stateUser.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <InputComponent
                value={stateUser.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item label="Avatar" name="avatar">
              <WrapperUploadFile
                onChange={handleOnchangeAvatarDetails}
                maxCount={1}
              >
                {stateUser?.avatar && (
                  <img
                    src={stateUser?.avatar}
                    style={{
                      height: "60px",
                      width: "60px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      margin: "0 10px",
                    }}
                    alt="avatar"
                  />
                )}
                <Button>Chọn ảnh</Button>
              </WrapperUploadFile>
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa người dùng"
        open={isOpenModalDelete}
        onCancel={handleCloseModalDelete}
        onOk={handleDeleteUser}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa người dùng này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa tất cả người dùng đã chọn"
        open={isOpenModalDeleteMany}
        onCancel={handleCloseModalDeleteMany}
        onOk={handleDeleteManyUsers}
      >
        <Loading isPending={isPendingDeletedMany}>
          <div>Bạn có chắc muốn xóa tất cả người dùng đã chọn không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminUser;
