import { Col, Image, Row } from "antd";
import React from "react";
import {
  WrapperStyleNameProduct,
  WrapperStyleTextSell,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperInputNumber,
  WrapperDiscountText,
} from "./style";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import Loading from "../LoadingComponent/Loading";
import { useState } from "react";
import { convertPrice } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import * as message from "../Message/Message";
import { useQuery } from "@tanstack/react-query";
import {
  addOrderItem,
} from "../../redux/slices/OrderSlice";

const ProductDetailsComponent = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) =>
    state.orders?.find((order) => order.user === user.id)
  );
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [numProduct, setNumProduct] = useState(1);

  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const handleChangeCount = (type, limited) => {
    if (type === "increase") {
      if (!limited) {
        setNumProduct(numProduct + 1);
      }
    } else {
      if (!limited) {
        setNumProduct(numProduct - 1);
      }
    }
  };

  const fetchDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await ProductService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchDetailsProduct,
    enabled: !!idProduct,
  });

  // console.log(productDetails);

  const handleAddToCart = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      const orderItem = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderItem?.quantity + numProduct <= orderItem?.quantityInStock ||
        (!orderItem && productDetails?.quantityInStock > 0)
      ) {
        dispatch(
          addOrderItem({
            orderItem: {
              name: productDetails?.name,
              quantity: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              discount: productDetails?.discount,
              product: productDetails?._id,
              quantityInStock: productDetails?.quantityInStock,
            },
            userId: user.id,
          })
        );
        message.success("Đã thêm vào giỏ hàng");
      } else {
        message.error(
          `Số lượng hàng trong kho không đủ. Còn ${productDetails?.quantityInStock} sản phẩm`
        );
      }
    }
  };

  return (
    <Loading isPending={isPending}>
      <Row
        style={{
          padding: "16px",
          background: "#fff",
          borderRadius: "4px",
          height: "100%",
        }}
      >
        <Col
          span={10}
          style={{
            borderRight: "1px solid #e5e5e5",
            paddingRight: "8px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview={true}
          />
        </Col>
        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct style={{ fontWeight: 600 }}>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <WrapperStyleNameProduct>
            Mô Tả: {productDetails?.description}
          </WrapperStyleNameProduct>
          <div>
            <WrapperStyleTextSell>
              Đã bán: {productDetails?.sold}
            </WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              {convertPrice(productDetails?.price)}
              <WrapperDiscountText>
                {productDetails?.discount ? (
                  `-${productDetails?.discount}%`
                ) : (
                  <></>
                )}
              </WrapperDiscountText>
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <div
            style={{
              margin: "10px 0 20px",
              padding: "10px 0",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "10px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() => handleChangeCount("decrease", numProduct === 1)}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
              <WrapperInputNumber
                onChange={onChange}
                defaultValue={1}
                max={productDetails?.quantityInStock}
                min={1}
                value={numProduct}
                size="small"
              />
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleChangeCount(
                    "increase",
                    numProduct === productDetails?.quantityInStock
                  )
                }
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div>
              <ButtonComponent
                size={40}
                disabled={user?.role === "Admin" || user?.role === "Nhân viên"}
                buttonStyle={{
                  background: "rgb(255, 57, 69)",
                  height: "48px",
                  width: "220px",
                  border: "none",
                  borderRadius: "4px",
                }}
                onClick={handleAddToCart}
                buttonText={"Thêm vào giỏ hàng"}
                buttonTextStyle={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
