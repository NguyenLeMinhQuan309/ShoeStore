import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cart from "../Cart/Cart";
import "./Login_Signup.css";
import { Input, Button, Modal, Popover, notification } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import UserInfoModal from "../UserInfo/UserInfo";
import MyOrder from "../MyOrder/MyOrder";
import PurchaseHistoryModal from "../PurchaseHistoryModal/PurchaseHistoryModal";

const Login_Signup = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [nameInputValue, setNameInputValue] = useState("");
  const [phoneInputValue, setPhoneInputValue] = useState("");
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    useState("");
  const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] =
    useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [isPurchaseHistoryModalVisible, setIsPurchaseHistoryModalVisible] =
    useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    // window.location.reload();
    navigate("/");
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIsLogin(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setEmailInputValue("");
    setPasswordInputValue("");
    setNameInputValue("");
    setPasswordConfirmInputValue("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 3,
    });
  };

  const handleLogin = async () => {
    if (!emailInputValue && !passwordInputValue) {
      openNotification(
        "error",
        "Lỗi đăng nhập",
        "Vui lòng nhập Email và Mật khẩu!"
      );
      return;
    }
    if (!emailInputValue) {
      openNotification("error", "Lỗi đăng nhập", "Vui lòng nhập Email!");
      return;
    }
    if (!passwordInputValue) {
      openNotification("error", "Lỗi đăng nhập", "Vui lòng nhập Mật khẩu!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email: emailInputValue,
        password: passwordInputValue,
      });
      if (response.data.user.role === "admin") {
        window.location.href = "http://localhost:4000";
      } else {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        openNotification(
          "success",
          "Đăng nhập thành công",
          "Chào mừng bạn trở lại!"
        );
        handleOk();
        window.location.reload();
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      openNotification(
        "error",
        "Đăng nhập thất bại",
        "Tài khoản hoặc mật khẩu không đúng!!!!"
      );
    }
  };

  const handleRegister = async () => {
    // Check if required fields are empty
    if (
      !nameInputValue ||
      !phoneInputValue ||
      !emailInputValue ||
      !passwordInputValue ||
      !passwordConfirmInputValue
    ) {
      openNotification(
        "error",
        "Đăng ký thất bại",
        "Vui lòng điền đầy đủ các trường thông tin."
      );
      return;
    }

    // Check if passwords match
    if (passwordInputValue !== passwordConfirmInputValue) {
      openNotification(
        "error",
        "Đăng ký thất bại",
        "Mật khẩu không khớp. Vui lòng thử lại."
      );
      return;
    }

    try {
      // Send the registration request
      await axios.post("http://localhost:3000/user/signup", {
        name: nameInputValue,
        phone: phoneInputValue,
        email: emailInputValue,
        password: passwordInputValue,
      });

      // Show success notification
      openNotification(
        "success",
        "Đăng ký thành công",
        "Bạn có thể đăng nhập ngay bây giờ!"
      );

      // Toggle the form or navigate as needed
      toggleForm();
    } catch (error) {
      console.error("Registration error:", error.response?.data);

      // Show error notification
      openNotification(
        "error",
        "Đăng ký thất bại",
        "Đã xảy ra lỗi trong quá trình đăng ký."
      );
    }
  };

  return (
    <div className="cart-login">
      <Cart />
      {user ? (
        <div className="user-info">
          <Popover
            content={
              <div className="propdown avt">
                <Button
                  type="link"
                  onClick={() => setIsPersonalInfoModalVisible(true)}
                >
                  Thông tin cá nhân
                </Button>
                <Button
                  type="link"
                  onClick={() => setIsOrderModalVisible(true)}
                >
                  Đơn hàng của tôi
                </Button>
                <Button
                  type="link"
                  onClick={() => setIsPurchaseHistoryModalVisible(true)}
                >
                  Lịch sử mua hàng
                </Button>
                <Button type="link" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            }
            trigger="hover"
          >
            <img
              src={
                user?.image ||
                "http://localhost:3000/user/uploads/userImage/default_avatar.png"
              }
              className="user-avatar"
              alt="user avatar"
            />
          </Popover>
          <span className="username">{user.name}</span>
        </div>
      ) : (
        <Button
          icon={<LoginOutlined />}
          color="default"
          variant="outlined"
          onClick={showModal}
        >
          Đăng nhập
        </Button>
      )}
      <Modal
        title={
          <span
            style={{
              fontSize: "20px",
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </span>
        }
        visible={isModalVisible}
        onOk={isLogin ? handleLogin : handleRegister}
        onCancel={handleCancel}
        okText={isLogin ? "Đăng nhập" : "Đăng ký"}
        cancelText="Hủy"
      >
        {isLogin ? (
          <>
            <Input
              required
              placeholder="Email"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input.Password
              placeholder="Password"
              value={passwordInputValue}
              onChange={(e) => setPasswordInputValue(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <span>Chưa có tài khoản? </span>
              <Button type="link" onClick={toggleForm}>
                Đăng ký
              </Button>
            </div>
          </>
        ) : (
          <>
            <Input
              placeholder="Họ và Tên"
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input
              placeholder="Số điện thoại"
              value={phoneInputValue}
              onChange={(e) => setPhoneInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input
              placeholder="Email"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input.Password
              placeholder="Mật khẩu"
              value={passwordInputValue}
              onChange={(e) => setPasswordInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input.Password
              placeholder="Xác nhận Mật khẩu"
              value={passwordConfirmInputValue}
              onChange={(e) => setPasswordConfirmInputValue(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <span>Đã có tài khoản? </span>
              <Button type="link" onClick={toggleForm}>
                Đăng nhập
              </Button>
            </div>
          </>
        )}
      </Modal>
      <UserInfoModal
        user={user}
        isPersonalInfoModalVisible={isPersonalInfoModalVisible}
        setIsPersonalInfoModalVisible={setIsPersonalInfoModalVisible}
        onUserUpdate={setUser}
      />
      <MyOrder
        isVisible={isOrderModalVisible}
        handleClose={() => setIsOrderModalVisible(false)}
        user={user}
      />
      <PurchaseHistoryModal
        isVisible={isPurchaseHistoryModalVisible}
        handleClose={() => setIsPurchaseHistoryModalVisible(false)}
        user={user}
      />
    </div>
  );
};

export default Login_Signup;
