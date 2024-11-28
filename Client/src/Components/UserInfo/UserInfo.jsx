import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Form,
  Row,
  Col,
  Tooltip,
  Select,
  notification,
  Button,
} from "antd";

import axios from "axios";

const { Option } = Select;

const UserInfoModal = ({
  user,
  isPersonalInfoModalVisible,
  setIsPersonalInfoModalVisible,
  onUserUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: user?.name,
    email: user?.email,
    gender: user?.gender,
    phone: user?.phone,
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
    image: user?.image,
  });

  const [initialValues, setInitialValues] = useState({});
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      // Fetch address using user.email
      const fetchAddress = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/address/${user.email}`
          );
          const address = response.data;
          setFormValues({
            name: user?.name || "",
            email: user?.email || "",
            gender: user?.gender !== undefined ? user?.gender : 0,
            phone: user?.phone || "",
            number: address?.number || "",
            street: address?.street || "",
            ward: address?.ward || "",
            district: address?.district || "",
            city: address?.city || "",
            image: user?.image || "",
          });
          setInitialValues({
            name: user?.name || "",
            email: user?.email || "",
            gender: user?.gender !== undefined ? user?.gender : 0,
            phone: user?.phone || "",
            number: address?.number || "",
            street: address?.street || "",
            ward: address?.ward || "",
            district: address?.district || "",
            city: address?.city || "",
            image: user?.image || "",
          });
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      };

      fetchAddress();
    }
  }, [user]);

  const handlePersonalInfoModalOk = () => {
    setIsEditing(true);
  };

  const handlePersonalInfoModalCancel = () => {
    if (!isEditing) {
      setIsPersonalInfoModalVisible(false);
    } else {
      setFormValues(initialValues);
      setIsEditing(false);
    }
  };

  const handlePasswordChangeModalCancel = () => {
    setIsPasswordModalVisible(false);
  };

  const handlePasswordChange = async () => {
    // Logic for handling password change
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      openNotification("error", "Mật khẩu mới không khớp.");
      return;
    }

    try {
      // Call API to update password
      const response = await axios.put(
        `http://localhost:3000/user/update-password/${user._id}`,
        {
          oldPassword: passwordValues.oldPassword,
          newPassword: passwordValues.newPassword,
          confirmPassword: passwordValues.confirmPassword,
        }
      );

      openNotification("success", "Mật khẩu đã được thay đổi.");
      setIsPasswordModalVisible(false); // Close password change modal
    } catch (error) {
      console.error("Error changing password:", error);
      openNotification("error", "Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleGenderChange = (value) => {
    setFormValues({ ...formValues, gender: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues({ ...formValues, image: file });
    } else {
      setFormValues({ ...formValues, image: null });
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      // Update user info
      const userResponse = await axios.put(
        `http://localhost:3000/user/update/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormValues({
        ...formValues,
        image: userResponse.data.user.image,
      });

      // Prepare address payload
      const addressPayload = {
        number: formValues.number,
        street: formValues.street,
        ward: formValues.ward,
        district: formValues.district,
        city: formValues.city,
      };

      // Try to update the address
      try {
        await axios.put(
          `http://localhost:3000/address/${user.email}`,
          addressPayload
        );
      } catch (updateError) {
        if (updateError.response?.status === 404) {
          await axios.post(`http://localhost:3000/address`, {
            email: user.email,
            ...addressPayload,
          });
        } else {
          console.error("Error updating address:", updateError);
          openNotification(
            "error",
            "Cập nhật địa chỉ thất bại. Vui lòng thử lại."
          );
        }
      }

      onUserUpdate(userResponse.data.user);
      localStorage.setItem("user", JSON.stringify(userResponse.data.user));
      setIsEditing(false);
      openNotification("success", "Cập nhật thông tin tài khoản thành công!");
    } catch (error) {
      console.error("Error updating user info:", error);
      openNotification(
        "error",
        "Cập nhật thông tin tài khoản thất bại. Vui lòng thử lại."
      );
    }
  };

  const showImageModal = () => {
    if (!isEditing) {
      setIsImageModalVisible(true);
    }
  };

  const handleImageModalCancel = () => {
    setIsImageModalVisible(false);
  };

  const openNotification = (type, message) => {
    notification[type]({
      message,
      placement: "topRight",
    });
  };

  return (
    <>
      <Modal
        title="Thông tin cá nhân"
        visible={isPersonalInfoModalVisible}
        onCancel={handlePersonalInfoModalCancel}
        onOk={isEditing ? handleSave : handlePersonalInfoModalOk}
        okText={isEditing ? "Lưu" : "Chỉnh sửa"}
        cancelText="Thoát"
        width={800}
        closable={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Tooltip title={isEditing ? "Sửa" : ""} placement="bottom">
            <div
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("imageUpload").click();
              }}
            >
              <img
                src={
                  formValues.image && formValues.image instanceof File
                    ? URL.createObjectURL(formValues.image)
                    : formValues.image || "src/assets/default_avatar.png"
                }
                alt="Avatar"
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  if (!isEditing) {
                    e.stopPropagation();
                    showImageModal();
                  }
                }}
              />
            </div>
          </Tooltip>
          <input
            type="file"
            id="imageUpload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <div>
            {isEditing ? (
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên">
                      <Input
                        name="name"
                        value={formValues.name}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Email">
                      <Input
                        disabled
                        name="email"
                        value={formValues.email}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Giới tính">
                      <Select
                        name="gender"
                        value={formValues.gender}
                        onChange={handleGenderChange}
                      >
                        <Option value={0}>Nam</Option>
                        <Option value={1}>Nữ</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Số điện thoại">
                      <Input
                        name="phone"
                        value={formValues.phone}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Số nhà">
                      <Input
                        name="number"
                        value={formValues.number}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Đường">
                      <Input
                        name="street"
                        value={formValues.street}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Phường">
                      <Input
                        name="ward"
                        value={formValues.ward}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Quận">
                      <Input
                        name="district"
                        value={formValues.district}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thành phố">
                      <Input
                        name="city"
                        value={formValues.city}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            ) : (
              <div>
                <p>
                  <strong>Tên:</strong> {user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Giới tính:</strong>{" "}
                  {formValues.gender === 0 ? "Nam" : "Nữ"}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {formValues.phone}
                </p>
                <p>
                  Địa chỉ:{" "}
                  {formValues.number ||
                  formValues.street ||
                  formValues.ward ||
                  formValues.district ||
                  formValues.city
                    ? `${formValues.number}, ${formValues.street}, ${formValues.ward}, ${formValues.district}, ${formValues.city}`
                    : "Địa chỉ chưa được cập nhật"}
                </p>
              </div>
            )}
            {/* Đổi mật khẩu button */}
            {!isEditing ? (
              <Button
                type="link"
                onClick={() => setIsPasswordModalVisible(true)}
              >
                Đổi mật khẩu
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>

      {/* Modal đổi mật khẩu */}
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
            Đổi mật khẩu
          </span>
        }
        visible={isPasswordModalVisible}
        onCancel={handlePasswordChangeModalCancel}
        onOk={handlePasswordChange}
        cancelText="Hủy"
        okText="Đổi mật khẩu"
      >
        <Form layout="vertical">
          <Form.Item
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
          >
            <Input.Password
              name="oldPassword"
              value={passwordValues.oldPassword}
              onChange={(e) =>
                setPasswordValues({
                  ...passwordValues,
                  oldPassword: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
          >
            <Input.Password
              name="newPassword"
              value={passwordValues.newPassword}
              onChange={(e) =>
                setPasswordValues({
                  ...passwordValues,
                  newPassword: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
            ]}
          >
            <Input.Password
              name="confirmPassword"
              value={passwordValues.confirmPassword}
              onChange={(e) =>
                setPasswordValues({
                  ...passwordValues,
                  confirmPassword: e.target.value,
                })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserInfoModal;
