import React from "react";
import { Dropdown, Space, Row, Col } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom"; // Import Link

const CATEGORIES = [
  { display: "Dép quai ngang", value: "depquainang" },
  { display: "Dép xỏ ngón", value: "depxongon" },
  { display: "Giày bóng rổ", value: "giaybongro" },
  { display: "Giày chạy bộ", value: "giaychaybo" },
  { display: "Giày đá bóng", value: "giaydabong" },
  { display: "Giày đi bộ", value: "giaydibo" },
  { display: "Giày sandal", value: "giaysandal" },
  { display: "Giày sneakers", value: "giaysneakers" },
];

const BRANDS = [
  "Adidas",
  "Hoka",
  "Nike",
  "Columbia",
  "Skechers",
  "On Running",
  "Saucony",
  "New Balance",
];

const CategoryComponent = () => {
  const categoryItems = CATEGORIES.map((category) => ({
    label: (
      <Link
        key={category.value}
        to={`/product?category=${category.value}`} // Use Link to navigate and pass category
      >
        {category.display}
      </Link>
    ),
    key: category.value,
  }));

  const brandItems = BRANDS.map((brand) => ({
    label: (
      <Link
        key={brand}
        to={`/product?brand=${brand}`} // Use Link to navigate and pass brand
      >
        {brand}
      </Link>
    ),
    key: brand,
  }));

  const menuItems = [
    {
      label: (
        <div>
          <strong>Loại Giày</strong>
          <Row>
            {categoryItems.map((item) => (
              <Col span={12} key={item.key}>
                {item.label}
              </Col>
            ))}
          </Row>
          <strong>Thương Hiệu</strong>
          <Row>
            {brandItems.map((item) => (
              <Col span={12} key={item.key}>
                {item.label}
              </Col>
            ))}
          </Row>
        </div>
      ),
      key: "all",
    },
  ];

  return (
    <div>
      <Dropdown
        menu={{
          items: menuItems,
        }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Danh mục
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default CategoryComponent;
