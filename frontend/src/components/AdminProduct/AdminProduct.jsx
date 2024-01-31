import { Button, Form, Select, Space } from "antd";
import React, { useRef } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponent";
import Loading from "../LoadingComponent/Loading";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64, validateNumber } from "../../utils";
import { useEffect } from "react";
import * as message from "../../components/Message/Message";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import * as CategoryService from "../../services/CategoryService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchOutlined } from "@ant-design/icons";

const AdminProduct = () => {
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

  const [stateProduct, setStateProduct] = useState({
    name: "",
    image: "",
    category: "",
    price: "",
    quantityInStock: "",
    discount: "",
    description: "",
    sold: "",
  });

  // console.log(stateProduct.category);

  // lấy tất cả product từ db
  const getAllProducts = async () => {
    const res = await ProductService.getAllProducts();
    return res?.data;
  };

  const { data: products, isPending: isPendingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  // console.log("products:", products);

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
    products?.length > 0 &&
    products?.map((product) => {
      return { ...product, key: product._id, category: categories.find((item) => item._id === product.category).name };
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
      sorter: (a, b) => a.name - b.name,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      ...getColumnSearchProps("price"),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      sorter: (a, b) => a.category - b.category,
      ...getColumnSearchProps("category"),
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      sorter: (a, b) => a.discount - b.discount,
      ...getColumnSearchProps("discount"),
    },
    {
      title: "Số lượng trong kho",
      dataIndex: "quantityInStock",
      sorter: (a, b) => a.quantityInStock - b.quantityInStock,
      ...getColumnSearchProps("quantityInStock"),
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      sorter: (a, b) => a.sold - b.sold,
      ...getColumnSearchProps("sold"),
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
      setStateProduct({
        name: "",
        image: "",
        category: "",
        price: "",
        quantityInStock: "",
        discount: "",
        description: "",
        sold: "",
      });
    }
  }, [isOpenModalCreate]);

  // lấy details product khi bấm nút sửa
  useEffect(() => {
    if (rowSelected && isOpenModalUpdate) {
      setIsPendingUpdate(true);
      fetchGetDetailsProduct(rowSelected, user?.access_token);
    }
  }, [rowSelected, isOpenModalUpdate]);

  const fetchGetDetailsProduct = async (rowSelected, access_token) => {
    const res = await ProductService.getDetailsProduct(
      rowSelected,
      access_token
    );
    categories?.data?.some((category) => category._id === res?.data?.category);
    // console.log(res);
    if (res?.data) {
      setStateProduct({
        name: res?.data?.name,
        image: res?.data?.image,
        category: categories?.data?.some(
          (category) => category._id === res?.data?.category
        )
          ? res?.data?.category
          : "Danh mục không tồn tại",
        price: res?.data?.price,
        quantityInStock: res?.data?.quantityInStock,
        discount: res?.data?.discount,
        description: res?.data?.description,
        sold: res?.data?.sold,
      });
    }
    setIsPendingUpdate(false);
  };

  // form chi tiết sản phẩm
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(stateProduct);
  }, [form, stateProduct]);

  const handleOnchangeDetails = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };

  // call api thêm sửa, xóa
  const mutationCreate = useMutationHooks((data) => {
    const { token, ...rests } = data;
    // console.log(data);
    const res = ProductService.createProduct({ ...rests }, token);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, name, image, ...rests } = data;
    const res = ProductService.updateProduct(id, { ...rests }, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    // console.log(data);
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeletedMany = useMutationHooks((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProducts(ids, token);
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

  const handleCreateProduct = () => {
    mutationCreate.mutate(
      { token: user?.access_token, ...stateProduct },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["products"]);
        },
      }
    );
  };

  const handleCloseModalCreate = () => {
    setIsOpenModalCreate(false);
    setStateProduct({
      name: "",
      image: "",
      category: "",
      price: "",
      quantityInStock: "",
      discount: "",
      description: "",
      sold: "",
    });
    form.resetFields();
  };

  const handleUpdateProduct = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateProduct },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["products"]);
        },
      }
    );
  };

  const handleCloseModalUpdate = () => {
    setIsOpenModalUpdate(false);
    setStateProduct({
      name: "",
      image: "",
      category: "",
      price: "",
      quantityInStock: "",
      discount: "",
      description: "",
      sold: "",
    });
    form.resetFields();
  };

  const handleCloseModalDelete = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["products"]);
        },
      }
    );
  };

  const handleCloseModalDeleteMany = () => {
    setIsOpenModalDeleteMany(false);
  };

  const handleDeleteManyProducts = (ids) => {
    mutationDeletedMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSettled: () => {
          queryClient.invalidateQueries(["products"]);
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lý sản phẩm</WrapperHeader>

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
          isPending={isPendingProducts}
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
        title={isOpenModalCreate ? "Tạo mới sản phẩm" : "Sửa sản phẩm"}
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="on"
            form={form}
            onFinish={
              isOpenModalCreate ? handleCreateProduct : handleUpdateProduct
            }
          >
            {isOpenModalCreate || stateProduct.sold <= 0 ? (
              <Form.Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: "Mời nhập tên!" }]}
              >
                <InputComponent
                  value={stateProduct.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
            ) : (
              <Form.Item label="Tên">{stateProduct.name}</Form.Item>
            )}
            {/* {stateProduct.sold <= 0 ? ( */}
            <Form.Item
              label="Giá (đ)"
              name="price"
              rules={[
                { required: true, message: "Mời nhập giá!" },
                {
                  validator: validateNumber,
                },
              ]}
            >
              <InputComponent
                value={stateProduct.price}
                onChange={handleOnchangeDetails}
                name="price"
              />
            </Form.Item>
            {/* ) : (
              <Form.Item label="Giá">{stateProduct.price}</Form.Item>
            )} */}
            <Loading isPending={isPendingCategories}>
              <Form.Item
                label="Danh mục"
                name="category"
                rules={[{ required: true, message: "Mời chọn danh mục!" }]}
              >
                <Select
                  value={stateProduct.category}
                  onChange={(value) =>
                    handleOnchangeDetails({
                      target: { name: "category", value },
                    })
                  }
                  placeholder="Chọn danh mục"
                >
                  {categories?.map((category) => (
                    <Select.Option key={category._id} value={category._id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Loading>
            {stateProduct.sold <= 0 ? (
              <Form.Item
                label="Số lượng trong kho"
                name="quantityInStock"
                rules={[
                  { required: true, message: "Mời nhập số lượng trong kho!" },
                  {
                    validator: validateNumber,
                  },
                ]}
              >
                <InputComponent
                  value={stateProduct.quantityInStock}
                  onChange={handleOnchangeDetails}
                  name="quantityInStock"
                />
              </Form.Item>
            ) : (
              <Form.Item label="Số lượng trong kho">
                {stateProduct.quantityInStock}
              </Form.Item>
            )}

            <Form.Item
              label="Giảm giá (%)"
              name="discount"
              rules={[
                { required: true, message: "Mời nhập % giảm giá!" },
                {
                  validator: validateNumber,
                },
              ]}
            >
              <InputComponent
                value={stateProduct.discount}
                onChange={handleOnchangeDetails}
                name="discount"
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <InputComponent
                value={stateProduct.description}
                onChange={handleOnchangeDetails}
                name="description"
              />
            </Form.Item>

            {stateProduct.sold <= 0 ? (
              <Form.Item
                label="Ảnh"
                name="image"
                rules={[{ required: true, message: "Mời chọn ảnh!" }]}
              >
                <WrapperUploadFile
                  onChange={handleOnchangeAvatarDetails}
                  maxCount={1}
                >
                  {stateProduct?.image && (
                    <img
                      src={stateProduct?.image}
                      style={{
                        height: "60px",
                        width: "60px",
                        objectFit: "cover",
                        margin: "0 10px",
                      }}
                      alt="ảnh"
                    />
                  )}
                  <Button>Chọn ảnh</Button>
                </WrapperUploadFile>
              </Form.Item>
            ) : (
              <Form.Item label="Ảnh">
                <img
                  src={stateProduct?.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="ảnh"
                />
              </Form.Item>
            )}
          </Form>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa sản phẩm"
        open={isOpenModalDelete}
        onCancel={handleCloseModalDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
        </Loading>
      </ModalComponent>

      <ModalComponent
        title="Xóa tất cả sản phẩm đã chọn"
        open={isOpenModalDeleteMany}
        onCancel={handleCloseModalDeleteMany}
        onOk={handleDeleteManyProducts}
      >
        <Loading isPending={isPendingDeletedMany}>
          <div>Bạn có chắc muốn xóa tất cả sản phẩm đã chọn không?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default AdminProduct;
