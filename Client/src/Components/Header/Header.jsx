import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Input } from "antd";
import { useSearch } from "../../Context/SearchContext"; // Adjust the path accordingly
import Login_Signup from "../Login_Signup/Login_Signup";
import "./Header.css";

const { Header } = Layout;

const HeaderComponent = () => {
  const { setSearchTerm } = useSearch(); // Get setSearchTerm from context
  const [inputValue, setInputValue] = useState("");

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
    setSearchTerm(e.target.value); // Update the search term in context
  };

  return (
    <Layout>
      <Header className="header">
        <Link to="/">
          <div className="logo">ShoesShop</div>
        </Link>
        <nav>
          <ul>
            <li>
              <Link to="/description">Giới thiệu</Link>
            </li>
            <li>
              <Link to="/product">Sản phẩm</Link>
            </li>
          </ul>
        </nav>
        <Input
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearchChange}
        />
        <Login_Signup />
      </Header>
    </Layout>
  );
};

export default HeaderComponent;
