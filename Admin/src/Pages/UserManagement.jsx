import { useState, useEffect } from "react";
import { Button, Card, Typography, notification } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import UserTable from "../components/UserTable/UserTable";
import AddUserModal from "../components/AddUserModal/AddUserModal";
import "./css/UserManagement.css";

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    image: "", // Đổi avatar thành image
    role: "customer",
    password: "",
    gender: null,
  });
  const [address, setAddress] = useState({
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/getall")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const addUser = () => {
    if (editingUser) {
      axios
        .put(`http://localhost:3000/user/update/${editingUser._id}`, newUser)
        .then(() => {
          // Cập nhật địa chỉ
          return axios.put(
            `http://localhost:3000/address/${editingUser.email}`,
            {
              ...address, // Địa chỉ từ state
            }
          );
        })
        .then(() => {
          // Refetch danh sách người dùng sau khi chỉnh sửa địa chỉ
          return axios.get("http://localhost:3000/user/getall");
        })
        .then((response) => {
          setUsers(response.data); // Cập nhật lại danh sách người dùng
          setShowPopup(false); // Đóng popup
          // Thông báo thành công
          notification.success({
            message: "Success",
            description: "User and address updated successfully!",
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          // Thông báo lỗi
          notification.error({
            message: "Error",
            description: "Failed to update user or address.",
          });
        });
    } else {
      axios
        .post("http://localhost:3000/user/signup", newUser)
        .then((response) => {
          const email = newUser.email; // Lấy ID của user mới
          // Gửi địa chỉ lên API
          return axios.post("http://localhost:3000/address", {
            email, // Gửi kèm ID của user
            ...address, // Địa chỉ từ state
          });
        })
        .then(() => {
          // Refetch danh sách người dùng sau khi thêm địa chỉ
          return axios.get("http://localhost:3000/user/getall");
        })
        .then((response) => {
          setUsers(response.data); // Cập nhật lại danh sách người dùng
          setShowPopup(false); // Đóng popup
          // Thông báo thành công
          notification.success({
            message: "Success",
            description: "User and address added successfully!",
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          // Thông báo lỗi
          notification.error({
            message: "Error",
            description: "Failed to add user or address.",
          });
        });
    }
  };

  const handleEdit = (user) => {
    fetchAddress(user.email);
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image, // Đổi avatar thành image
      role: user.role,
      gender: user.gender,
    });
    setShowPopup(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setAddress({
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
    });
    setNewUser({
      name: "",
      email: "",
      phone: "",
      image: "", // Đổi avatar thành image
      role: "customer",
      password: "",
      gender: null,
    });
  };

  const handleCloseModal = () => {
    setShowPopup(false); // Đóng modal
    resetForm(); // Reset form sau khi đóng modal
  };

  const fetchAddress = async (email) => {
    if (email) {
      try {
        const response = await fetch(`http://localhost:3000/address/${email}`);
        if (response.ok) {
          const data = await response.json();
          setAddress({
            number: data.number || "",
            street: data.street || "",
            ward: data.ward || "",
            district: data.district || "",
            city: data.city || "",
          });
        } else {
          console.error("Error fetching address:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    }
  };
  return (
    <div className="user-management-container">
      <Title level={2} className="user-management-title">
        User Management
      </Title>
      <Button
        type="primary"
        onClick={() => {
          resetForm(); // Reset form trước khi mở modal
          setShowPopup(true);
        }}
        icon={<PlusOutlined />}
        className="user-management-add-button"
      >
        Add User
      </Button>
      <AddUserModal
        showPopup={showPopup}
        setShowPopup={handleCloseModal} // Sử dụng handleCloseModal để reset form
        newUser={newUser}
        setNewUser={setNewUser}
        addUser={addUser}
        address={address}
        setAddress={setAddress}
        isEditing={editingUser !== null}
      />
      <Card>
        <UserTable users={users} onEdit={handleEdit} />
      </Card>
    </div>
  );
};

export default UserManagement;
