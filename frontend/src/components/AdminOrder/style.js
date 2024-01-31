import styled from "styled-components";

export const WrapperHeader = styled.h2`
    // color: #000;
    // font-size: 14px;
`

export const WrapperCurrentStatus = styled.span`
  color: ${props => {
    switch (props.children) {
      case "Chờ xử lý":
        return "#faad14";
      case "Đang giao":
        return "#1890ff";
      case "Đã giao":
        return "#52c41a";
      default:
        return "inherit";
    }
  }};
`;
