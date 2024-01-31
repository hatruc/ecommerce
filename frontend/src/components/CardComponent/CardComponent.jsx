import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleTextSell,
} from "./style";
import logo from "../../assets/images/logo1.png";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const {
    quantityInStock,
    description,
    image,
    name,
    price,
    category,
    discount,
    sold,
    id,
  } = props;
  const navigate = useNavigate();
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };
  return (
    <WrapperCardStyle
      hoverable
      headStyle={{ width: "200px", height: "200px" }}
      style={{ width: 200 }}
      bodyStyle={{ padding: "10px" }}
      cover={<img alt="example" src={image} />}
      onClick={() => handleDetailsProduct(id)}
    >
      <img
        src={logo}
        alt={name}
        style={{
          width: "89px",
          height: "20px",
          position: "absolute",
          top: 0,
          left: 0,
          borderTopLeftRadius: "3px",
        }}
      />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <WrapperStyleTextSell>Đã bán {sold}</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{marginRight: "8px"}}>{convertPrice(price)}</span>
        {discount ? (
          <WrapperDiscountText>-{discount} %</WrapperDiscountText>
        ) : (
          <></>
        )}
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
