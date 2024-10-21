import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryComponent from "../Category/Category";
import "./Header.css";
import Login_Signup from "../Login_Signup/Login_Signup";
import { Link } from "react-router-dom";
import { Layout, Dropdown, Space, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent = () => {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Layout>
      <Header className="header">
        <Link to="/">
          <div className="logo" onClick={() => setMenu("home")}>
            ShoesShop
          </div>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/description">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/product">Sản phẩm</Link>
            </li>
            <li>
              <CategoryComponent />
            </li>
          </ul>
        </nav>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Login_Signup />
      </Header>
    </Layout>
  );
};

export default HeaderComponent;
