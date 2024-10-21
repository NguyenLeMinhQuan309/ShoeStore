import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Tooltip, Select } from "antd";
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

      console.log("Updated user info:", userResponse.data);
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
          `http://localhost:3000/address/${user.email}`, // Use email to identify the address
          addressPayload
        );
        console.log("Address updated successfully");
      } catch (updateError) {
        // If the update fails, create a new address
        if (updateError.response?.status === 404) {
          await axios.post(`http://localhost:3000/address`, {
            email: user.email,
            ...addressPayload,
          });
          console.log("New address created successfully");
        } else {
          console.error("Error updating address:", updateError);
          alert("There was an error updating the address. Please try again.");
        }
      }

      onUserUpdate(userResponse.data.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user info:", error);
      alert("There was an error updating the user info. Please try again.");
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

  return (
    <>
      <Modal
        title="Thông tin cá nhân"
        visible={isPersonalInfoModalVisible}
        onCancel={handlePersonalInfoModalCancel}
        onOk={isEditing ? handleSave : handlePersonalInfoModalOk}
        okText={isEditing ? "Lưu" : "Chỉnh sửa"}
        cancelText="Thoát"
        closable={false}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <Tooltip title="Sửa" placement="bottom">
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
                  e.stopPropagation();
                  showImageModal();
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
                <Form.Item label="Tên">
                  <Input
                    name="name"
                    value={formValues.name}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                  />
                </Form.Item>
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
                <Form.Item label="Số điện thoại">
                  <Input
                    name="phone"
                    value={formValues.phone}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Số nhà">
                  <Input
                    name="number"
                    value={formValues.number}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Đường">
                  <Input
                    name="street"
                    value={formValues.street}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Phường">
                  <Input
                    name="ward"
                    value={formValues.ward}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Quận">
                  <Input
                    name="district"
                    value={formValues.district}
                    onChange={handleInputChange}
                  />
                </Form.Item>
                <Form.Item label="Thành phố">
                  <Input
                    name="city"
                    value={formValues.city}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Form>
            ) : (
              <div>
                <p>Tên: {formValues?.name}</p>
                <p>Email: {formValues?.email}</p>
                <p>Giới tính: {formValues?.gender === 0 ? "Nam" : "Nữ"}</p>
                <p>Số điện thoại: {formValues?.phone}</p>
                <p>
                  Địa chỉ:{" "}
                  {`${formValues.number}, ${formValues.street}, ${formValues.ward}, ${formValues.district}, ${formValues.city}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal for displaying enlarged image */}
      <Modal
        visible={isImageModalVisible}
        onCancel={handleImageModalCancel}
        footer={null}
        width={300}
      >
        <img
          src={
            formValues.image && formValues.image instanceof File
              ? URL.createObjectURL(formValues.image)
              : formValues.image || "src/assets/default_avatar.png"
          }
          alt="Enlarged Avatar"
          style={{ width: "100%", height: "auto" }}
        />
      </Modal>
    </>
  );
};

export default UserInfoModal;
