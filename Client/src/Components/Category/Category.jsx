import React, { useState, useEffect } from "react";
import { Dropdown, Space, Spin } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";

const CategoryComponent = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/category/getAll"
        );
        setCategories(response.data);
        console.log(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Map categories to dropdown items
  const items = categories.map((category) => ({
    label: (
      <a
        key={category.id}
        target="_blank"
        rel="noopener noreferrer"
        href={`#category-${category.id}`} // Replace with actual link logic
      >
        {category.name}
      </a>
    ),
    key: category.id,
  }));

  return (
    <div>
      {loading ? (
        <Spin /> // Display loading spinner while categories are being fetched
      ) : (
        <Dropdown
          menu={{
            items,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Danh mục
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      )}
    </div>
  );
};

export default CategoryComponent;
