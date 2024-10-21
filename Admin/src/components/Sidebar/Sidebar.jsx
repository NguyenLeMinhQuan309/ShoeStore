import React from "react";
import { Layout, Menu } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  // Định nghĩa các mục menu
  const items = [
    {
      key: "1",
      icon: <UserOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/user" style={{ color: "#000" }}>
          Quản lý khách hàng
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
      key: "5",
      icon: <SettingOutlined style={{ color: "#000" }} />,
      label: (
        <Link to="/status" style={{ color: "#000" }}>
          Trạng thái đơn hàng
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
        defaultSelectedKeys={["1"]}
        items={items} // Sử dụng items để định nghĩa các mục menu
        style={{ background: "#f5f5f5", color: "#000" }} // Nền menu và màu chữ đen
        theme="light" // Để đảm bảo menu có nền sáng
      />
    </Sider>
  );
};

export default Sidebar;
