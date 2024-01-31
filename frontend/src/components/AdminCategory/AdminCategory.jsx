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
import * as CategoryService from "../../services/CategoryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";

const AdminCategory = () => {
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

  const [stateCategory, setStateCategory] = useState({
    name: "",
  });

  // lấy tất cả category từ db
  const getAllCategories = async () => {
    const res = await CategoryService.getAllCategories();
    return res?.data;
  };

  const { data: categories, isPending: isPendingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // table
  const dataTable =
    categories?.length > 0 &&
    categories?.map((category) => {
      return { ...category, key: category._id };
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
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name - b.name,
      ...getColumnSearchProps("name"),
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
      setStateCategory({
        name: "",
      });
    }
  }, [isOpenModalCreate]);

  // lấy details category khi bấm nút sửa
  useEffect(() => {
    if (rowSelected && isOpenModalUpdate) {
      setIsPendingUpdate(true);
      fetchGetDetailsCategory(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenModalUpdate]);

  const fetchGetDetailsCategory = async (rowSelected, access_token) => {
    const res = await CategoryService.getDetailsCategory(rowSelected);
    if (res?.data) {
      setStateCategory({
        name: res?.data?.name,
      });
    }
    setIsPendingUpdate(false);
  };

  // form chi tiết danh mục
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(stateCategory);
  }, [form, stateCategory]);

  const handleOnchangeDetails = (e) => {
    setStateCategory({
      ...stateCategory,
      [e.target.name]: e.target.value,
    });
  };

  // call api thêm sửa, xóa
  const mutationCreate = useMutationHooks((data) => {
    const { token, ...rests } = data;
    // console.log(data);
    const res = CategoryService.createCategory({ ...rests }, token);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = CategoryService.updateCategory(id, { ...rests }, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    // console.log(data);
    const res = CategoryService.deleteCategory(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = CategoryService.deleteManyCategories(ids, token);
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

  const handleCreateCategory = () => {
    mutationCreate.mutate(
      { token: user?.access_token, ...stateCategory },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["categories"]);
        },
      }
    );
  };

  const handleCloseModalCreate = () => {
    setIsOpenModalCreate(false);
    setStateCategory({
      name: "",
    });
    form.resetFields();
  };

  const handleUpdateCategory = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...stateCategory,
      },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["categories"]);
        },
      }
    );
  };

  const handleCloseModalUpdate = () => {
    setIsOpenModalUpdate(false);
    setStateCategory({
      name: "",
    });
    form.resetFields();
  };

  const handleCloseModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteCategory = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["categories"]);
        },
      }
    );
  };

  const handleCloseModalDeleteMany = () => {
    setIsOpenModalDeleteMany(false);
  };

  const handleDeleteManyCategories = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["categories"]);
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý danh mục</WrapperHeader>

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
          isPending={isPendingCategories}
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
        title={isOpenModalCreate ? "Tạo mới danh mục" : "Sửa danh mục"}
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
            onFinish={
              isOpenModalCreate ? handleCreateCategory : handleUpdateCategory
            }
          >
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: "Mời nhập tên!" }]}
            >
              <InputComponent
                value={stateCategory.name}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa danh mục"
        open={isOpenModalDelete}
        onCancel={handleCloseModalDelete}
        onOk={handleDeleteCategory}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa danh mục này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa tất cả danh mục đã chọn"
        open={isOpenModalDeleteMany}
        onCancel={handleCloseModalDeleteMany}
        onOk={handleDeleteManyCategories}
      >
        <Loading isPending={isPendingDeletedMany}>
          <div>Bạn có chắc muốn xóa tất cả danh mục đã chọn không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminCategory;
