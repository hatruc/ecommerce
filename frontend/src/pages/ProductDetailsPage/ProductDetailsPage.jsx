import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { Breadcrumb } from "antd";
import { WrapperBreadcrumbLink } from "./style";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = url => {
    navigate(url)
  }
  return (
    <div style={{ width: "100%", background: "#efefef", height: "100%" }}>
      <div
        style={{
          width: "1270px",
          height: "100%",
          margin: "0 auto",
          paddingBottom: "100px",
        }}
      >
        <Breadcrumb
        style={{padding: '10px 0'}}
          items={[
            {
              title: <WrapperBreadcrumbLink onClick={() => handleNavigate("/")}>Trang chủ</WrapperBreadcrumbLink>,
            },
            {
              title: "Chi tiết sản phẩm",
            },
          ]}
        />
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
