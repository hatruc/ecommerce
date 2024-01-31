import React, { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    buttonText,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13, 92, 182)",
    colorButton = "#fff",
    handleSearch,
  } = props;
  
  const [searchValue, setSearchValue]  = useState('')

  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{ backgroundColor: backgroundColorInput }}
        onChange={e => setSearchValue(e.target.value)}
        onPressEnter={() => handleSearch(searchValue)}
      />
      <ButtonComponent
        size={size}
        buttonStyle={{
          background: backgroundColorButton,
          border: !bordered && "none",
        }}
        icon={<SearchOutlined color={colorButton} style={{ color: "#fff" }} />}
        buttonText={buttonText}
        buttonTextStyle={{ color: colorButton }}
        onClick={() => handleSearch(searchValue)}
      />
    </div>
  );
};

export default ButtonInputSearch;
