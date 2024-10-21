import { useState, useEffect } from "react";
import { Button, Card, Typography } from "antd";
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
    address: "",
    image: "", // Đổi avatar thành image
    role: "customer",
    password: "",
    profileImage: "",
    gender: null,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user/getall")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("There was an error!", error));
  }, [users]);

  const addUser = () => {
    if (editingUser) {
      // Cập nhật user nếu đang trong chế độ chỉnh sửa
      axios
        .put(`http://localhost:3000/user/update/${editingUser._id}`, newUser)
        .then((response) => {
          const updatedUsers = users.map((user) =>
            user._id === editingUser._id ? response.data : user
          );
          setUsers(updatedUsers);
          setShowPopup(false);
        })
        .catch((error) => console.error("There was an error!", error));
    } else {
      // Thêm user mới
      axios
        .post("http://localhost:3000/user/add", newUser)
        .then((response) => {
          setUsers([...users, response.data]);
          setShowPopup(false);
        })
        .catch((error) => console.error("There was an error!", error));
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      image: user.image, // Đổi avatar thành image
      role: user.role,
      password: user.password, // Hiển thị mật khẩu
      profileImage: user.profileImage,
      gender: user.gender,
    });
    setShowPopup(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setNewUser({
      name: "",
      email: "",
      phone: "",
      address: "",
      image: "", // Đổi avatar thành image
      role: "customer",
      password: "",
      profileImage: "",
      gender: null,
    });
  };

  const handleCloseModal = () => {
    setShowPopup(false); // Đóng modal
    resetForm(); // Reset form sau khi đóng modal
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
        isEditing={editingUser !== null}
      />
      <Card>
        <UserTable users={users} onEdit={handleEdit} />
      </Card>
    </div>
  );
};

export default UserManagement;
