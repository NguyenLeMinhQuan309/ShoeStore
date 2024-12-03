import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  SettingOutlined,
  MessageOutlined,
  LogoutOutlined, // Add the comment icon
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  // Định nghĩa các mục menu
  const items = [
    {
      key: "5",
      icon: <SettingOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/" style={{ color: "#000" }}>
          Thống kê doanh thu
        </Link>
      ),
    },
    {
      key: "1",
      icon: <UserOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/user" style={{ color: "#000" }}>
          Quản lý tài khoản
        </Link>
      ),
    },
    {
      key: "2",
      icon: <ShoppingCartOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/product" style={{ color: "#000" }}>
          Quản lý sản phẩm
        </Link>
      ),
    },
    {
      key: "3",
      icon: <AppstoreOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/category" style={{ color: "#000" }}>
          Quản lý danh mục
        </Link>
      ),
    },
    {
      key: "4",
      icon: <OrderedListOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/order" style={{ color: "#000" }}>
          Quản lý đơn hàng
        </Link>
      ),
    },
    {
      key: "6",
      icon: <MessageOutlined style={{ color: "#000" }} />, // Comment icon
      label: (
        <Link to="/comment" style={{ color: "#000" }}>
          Quản lý bình luận
        </Link>
      ),
    },
    {
      key: "7",
      icon: <LogoutOutlined style={{ color: "#000" }} />,
      label: (
        <Link
          style={{ color: "#000" }}
          onClick={() => {
            // Thực hiện đăng xuất (nếu có) và chuyển hướng đến trang đăng nhập hoặc trang khác
            window.location.href = "http://localhost:5173/"; // Điều hướng đến trang đăng nhập
          }}
        >
          Đăng xuất
        </Link>
      ),
    },
  ];

  return (
    <Sider
      collapsed={collapsed}
      trigger={null} // Loại bỏ nút mũi tên
      collapsible // Để sidebar vẫn có thể thu gọn
      style={{ background: "#f5f5f5" }} // Màu nền sidebar
    >
      <div style={{ padding: "16px", color: "#000", textAlign: "center" }}>
        <MenuOutlined style={{ fontSize: "24px", color: "#000" }} />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={["5"]}
        items={items} // Sử dụng items để định nghĩa các mục menu
        style={{ background: "#f5f5f5", color: "#000" }} // Nền menu và màu chữ đen
        theme="light" // Để đảm bảo menu có nền sáng
      />
    </Sider>
  );
};

export default Sidebar;
