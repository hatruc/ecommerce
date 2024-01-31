import { Menu } from "antd";
import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import {
  UserOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  BarsOutlined,
  CarOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminCategory from "../../components/AdminCategory/AdminCategory";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminShippingPrice from "../../components/AdminShippingPrice/AdminShippingPrice";
import AdminOrder from "../../components/AdminOrder/AdminOrder";

const AdminPage = () => {
  const items = [
    { label: "Người dùng", key: "users", icon: <UserOutlined /> },
    { label: "Danh mục", key: "categories", icon: <BarsOutlined /> },
    { label: "Sản phẩm", key: "products", icon: <ShoppingOutlined /> },
    { label: "Phí giao hàng", key: "shipping-prices", icon: <CarOutlined /> },
    { label: "Đơn hàng", key: "orders", icon: <ShoppingCartOutlined /> },
  ];

  return (
    <>
      <HeaderComponent
        isHiddenSearch
        isHiddenCart
        style={{ position: "fixed", zIndex: 1000 }}
      />
      <div style={{ display: "flex", overflowX: "hidden" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "92.8vh",
            position: "fixed",
            marginTop: "52px",
          }}
        >
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={`/admin/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
        <div
          style={{
            flex: 1,
            marginLeft: "256px",
            padding: "15px 0 15px 15px",
            marginTop: "52px",
          }}
        >
          <Routes>
            <Route path="users" element={<AdminUser />} />
            <Route path="categories" element={<AdminCategory />} />
            <Route path="products" element={<AdminProduct />} />
            <Route path="shipping-prices" element={<AdminShippingPrice />} />
            <Route path="orders" element={<AdminOrder />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
