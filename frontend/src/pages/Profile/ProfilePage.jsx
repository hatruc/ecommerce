import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import * as message from "../../components/Message/Message";
import { updateUser } from "../../redux/slices/UserSlice";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { useLocation, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");

  const mutation = useMutationHooks((data) => {
    const { id, token, email, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res
  });

  const dispatch = useDispatch();
  const { data, isPending, isSuccess } = mutation;
  console.log(data, isPending, isSuccess);

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setDateOfBirth(user?.dateOfBirth);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleGetDetailsUser(user?.id, user?.access_token);
    } else {
      if (data?.message) {
        message.error(data?.message);
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangeDateOfBirth = (value) => {
    setDateOfBirth(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      email,
      name,
      dateOfBirth,
      phone,
      address,
      avatar,
      token: user?.access_token,
    });
  };

  const handleCancel = () => {
    if (location?.state) {
      navigate(location?.state);
    }
  };

  return (
    <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <Loading isPending={isPending}>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <div style={{ width: "100%", padding: "4px 11px" }}>{email}</div>
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="name">Tên</WrapperLabel>
            <InputForm
              placeholder="Mời nhập tên"
              id="name"
              value={name}
              onChange={handleOnchangeName}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="dateOfBirth">Ngày sinh</WrapperLabel>
            <InputForm
              placeholder="Mời nhập ngày sinh"
              id="dateOfBirth"
              value={dateOfBirth}
              onChange={handleOnchangeDateOfBirth}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="phone">Số điện thoại</WrapperLabel>
            <InputForm
              placeholder="Mời nhập số điện thoại"
              id="phone"
              value={phone}
              onChange={handleOnchangePhone}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 10px",
                }}
                alt="avatar"
              />
            )}
            {/* <InputForm style={{ width: '300px' }} id="avatar" value={avatar} onChange={handleOnchangeAvatar} /> */}
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
            <InputForm
              placeholder="Mời nhập địa chỉ"
              id="address"
              value={address}
              onChange={handleOnchangeAddress}
            />
          </WrapperInput>

          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <ButtonComponent
              onClick={handleUpdate}
              size={40}
              buttonStyle={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              buttonText={"Cập nhật"}
              buttonTextStyle={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
            <ButtonComponent
              onClick={handleCancel}
              size={40}
              buttonStyle={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
              }}
              buttonText={"Hủy"}
              buttonTextStyle={{
                color: "rgb(26, 148, 255)",
                fontSize: "15px",
                fontWeight: "700",
              }}
            />
          </div>
        </WrapperContentProfile>
      </Loading>
    </div>
  );
};

export default ProfilePage;
