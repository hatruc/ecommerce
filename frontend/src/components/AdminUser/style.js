import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h2`
    // color: #000;
    // font-size: 14px;
`

export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
`