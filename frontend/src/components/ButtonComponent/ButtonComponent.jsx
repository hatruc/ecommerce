import { Button } from "antd";
import React from "react";

const ButtonComponent = ({
  buttonStyle,
  buttonTextStyle,
  buttonText,
  disabled,
  onClick,
  ...rests
}) => {
  const handleDisableOnclick = () => {};
  // console.log(disabled);
  return (
    <Button
      style={{
        ...buttonStyle,
        background: disabled ? "#ccc" : buttonStyle?.background,
        cursor: disabled ? "auto" : "pointer",
      }}
      onClick={disabled ? handleDisableOnclick : onClick}
      {...rests}
    >
      <span style={buttonTextStyle}>{buttonText}</span>
    </Button>
  );
};

export default ButtonComponent;
