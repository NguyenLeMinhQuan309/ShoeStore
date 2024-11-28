import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout, Input, Button } from "antd";
import { useSearch } from "../../Context/SearchContext"; // Import hook useSearch
import { SearchOutlined } from "@ant-design/icons";
import "./Header.css";
import Login_Signup from "../Login_Signup/Login_Signup";

const { Header } = Layout;

const HeaderComponent = () => {
  const [inputValue, setInputValue] = useState("");
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Cập nhật searchTerm từ context
  };

  // Xử lý khi nhấn nút tìm kiếm
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product?search=${searchTerm}`);
    }
  };

  // Xử lý khi chọn lọc theo Nam hoặc Nữ
  const handleGenderFilter = (gender) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), gender });
    navigate(`/product?gender=${gender}`);
  };

  return (
    <div>
      <Layout>
        <Header className="header">
          <div style={{ display: "flex" }}>
            <Link to={"/"}>
              <div className="logo">ShoesShop</div>
            </Link>
            <nav>
              <ul>
                <li>
                  <Button
                    type="text"
                    style={{ color: "white", fontSize: 20 }}
                    onClick={() => navigate(`/`)}
                    className="gender-filter"
                  >
                    Trang chủ
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    style={{ color: "white", fontSize: 20 }}
                    onClick={() => handleGenderFilter("male")}
                    className="gender-filter"
                  >
                    Nam
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    style={{ color: "white", fontSize: 20 }}
                    onClick={() => handleGenderFilter("female")}
                    className="gender-filter"
                  >
                    Nữ
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
          <div className="search-container">
            <Input
              placeholder="Search..."
              value={searchTerm} // Sử dụng searchTerm từ context
              onChange={handleSearchChange}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              style={{
                marginLeft: 3,
                borderRadius: "0 20px 20px 0",
                backgroundColor: "gray",
              }}
            ></Button>
          </div>
          <Login_Signup />
        </Header>
      </Layout>
    </div>
  );
};

export default HeaderComponent;
