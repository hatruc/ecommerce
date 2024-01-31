import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
`;

export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
`;

export const WrapperLabel = styled.span`
  // font-size: 12px;
  color: #000;
  font-weight: bold;
`;

export const WrapperContentInfo = styled.div`
  margin-top: 10px;
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  border-radius: 4px;
  min-height: 100px;
  padding: 16px;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

export const WrapperCurrentStatus = styled.span`
  color: ${(props) => {
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

export const WrapperStyleContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  background: #fff;
  padding: 17px 20px;
  border-radius: 10px;
`;

export const WrapperStyleHeader = styled.div`
  background: rgb(255, 255, 255);
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 16px;
  }
`;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 16px;
  background: #fff;
`;

export const WrapperItemPrice = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  > * {
    min-width: 70px;
    text-align: center;
  }
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  &:last-child {
    color: red;
  }
`;
export const WrapperItemLabel = styled.div`
  width: 200px;
  &:last-child {
    font-weight: bold;
  }
`;

export const WrapperAllPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const WrapperButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const WrapperUpdateHistory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;
