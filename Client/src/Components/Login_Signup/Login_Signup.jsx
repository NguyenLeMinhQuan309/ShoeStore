import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cart from "../Cart/Cart";
import "./Login_Signup.css";
import { Input, Button, Modal, Popover } from "antd";
import UserInfoModal from "../UserInfo/UserInfo";
const Login_Signup = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [emailInputValue, setEmailInputValue] = useState("");
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [nameInputValue, setNameInputValue] = useState("");
  const [passwordConfirmInputValue, setPasswordConfirmInputValue] =
    useState("");
  const [isPersonalInfoModalVisible, setIsPersonalInfoModalVisible] =
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
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const showModal = () => {
    setIsModalVisible(true);
    setIsLogin(true); // Reset to login form
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setEmailInputValue("");
    setPasswordInputValue("");
    setNameInputValue("");
    setPasswordConfirmInputValue(""); // if added
    setIsRegistrationSuccess(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsRegistrationSuccess(false); // Reset success state
  };
  const showPersonalInfoModal = () => {
    setIsPersonalInfoModalVisible(true);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email: emailInputValue,
        password: passwordInputValue,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user); // Lưu user vào state để hiển thị trên UI
      handleOk();
    } catch (error) {
      console.error("Login error:", error.response.data);
      // Xử lý lỗi nếu cần, ví dụ như hiển thị thông báo cho người dùng
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3000/user/signup", {
        name: nameInputValue, // You'll need to manage this state
        email: emailInputValue,
        password: passwordInputValue, // You'll need to manage this state
      });
      if (passwordInputValue !== passwordConfirmInputValue) {
        console.error("Passwords do not match!");
        return;
      }
      setIsRegistrationSuccess(true);
      toggleForm();
    } catch (error) {
      console.error("Registration error:", error.response.data);
      // Handle error appropriately, e.g., show a message to the user
    }
  };
  const updateUserInfo = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Update local storage as well
  };
  const userMenuContent = (
    <div className="propdown avt">
      <Button type="link" onClick={showPersonalInfoModal}>
        Thông tin cá nhân
      </Button>
      <Button type="link" onClick={() => navigate("/my-order")}>
        Đơn hàng của tôi
      </Button>
      <Button type="link" onClick={() => navigate("/historical-order")}>
        Lịch sử mua hàng
      </Button>
      <Button type="link" onClick={() => anavigate("/my-discount")}>
        Ưu đãi của tôi
      </Button>
      <Button type="link" onClick={handleLogout}>
        Đăng xuất
      </Button>
    </div>
  );

  return (
    <div className="cart-login">
      <Cart />
      {user ? (
        <div className="user-info">
          <Popover content={userMenuContent} trigger="hover">
            <img
              src={user?.image || "src/assets/default_avatar.png"}
              className="user-avatar"
              alt="user avatar"
            />
          </Popover>
          <span className="username">{user.name}</span>
        </div>
      ) : (
        <Button type="dashed" onClick={showModal}>
          Đăng nhập
        </Button>
      )}
      <Modal
        title={isLogin ? "Đăng nhập" : "Đăng ký"}
        visible={isModalVisible}
        onOk={isLogin ? handleLogin : handleRegister}
        onCancel={handleCancel}
        okText={isLogin ? "Đăng nhập" : "Đăng ký"}
        cancelText="Hủy"
      >
        {isLogin ? (
          <>
            <Input
              placeholder="Email"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Input.Password
              value={passwordInputValue}
              placeholder="Password"
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
              placeholder="Tên đầy đủ"
              value={nameInputValue}
              onChange={(e) => setNameInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input
              placeholder="Email"
              value={emailInputValue}
              onChange={(e) => setEmailInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <Input.Password
              placeholder="Password"
              value={passwordInputValue}
              onChange={(e) => setPasswordInputValue(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />
            <Input.Password
              placeholder="Xác nhận Password"
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
        onUserUpdate={updateUserInfo} // Pass the update function as a prop
      />
    </div>
  );
};
export default Login_Signup;
