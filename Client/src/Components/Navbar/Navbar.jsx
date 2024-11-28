import React, { useState } from "react";
import { Checkbox, Select, Divider, Row, Col, Button, Tag } from "antd";
import "./Navbar.css"; // Add custom styles if needed

const { Option } = Select;

const Navbar = ({
  brands,
  categories,
  colors,
  sizes,
  onFilterChange,
  onBrandChange,
  onColorChange,
  onSizeChange,
  onSortChange,
}) => {
  const [checkedFilters, setCheckedFilters] = useState({
    brands: [],
    categories: [],
    colors: [],
    sizes: [],
  });
  // console.log(brands.length);
  const [visibleFilter, setVisibleFilter] = useState(null);

  const handleCheckboxChange = (type, checkedValues) => {
    const uniqueCheckedValues = [...new Set(checkedValues)];

    setCheckedFilters((prevState) => {
      const updatedState = {
        ...prevState,
        [type]: uniqueCheckedValues,
      };

      switch (type) {
        case "brands":
          onBrandChange(uniqueCheckedValues);
          break;
        case "categories":
          onFilterChange(uniqueCheckedValues);
          break;
        case "colors":
          onColorChange(uniqueCheckedValues);
          break;
        case "sizes":
          onSizeChange(uniqueCheckedValues);
          break;
        default:
          break;
      }

      return updatedState;
    });
  };

  const handleRemoveFilter = (type, value) => {
    setCheckedFilters((prevState) => {
      const updatedFilters = prevState[type].filter((item) => item !== value);
      handleCheckboxChange(type, updatedFilters);
      return {
        ...prevState,
        [type]: updatedFilters,
      };
    });
  };

  const handleSortChange = (value) => {
    onSortChange(value);
  };

  const toggleFilter = (filter) => {
    setVisibleFilter(visibleFilter === filter ? null : filter);
  };

  const renderCheckboxGroup = (options, type) => (
    <div className="filter-content">
      <Checkbox.Group
        options={options}
        value={checkedFilters[type]}
        onChange={(checkedValues) => handleCheckboxChange(type, checkedValues)}
        style={{ display: "flex", flexDirection: "column" }}
        className="custom-checkbox-group"
      />
    </div>
  );

  const renderSelectedFilters = () => {
    const titles = {
      brands: "THƯƠNG HIỆU",
      categories: "LOẠI SẢN PHẨM",
      colors: "MÀU SẮC",
      sizes: "KÍCH THƯỚC",
    };

    return Object.keys(checkedFilters).map((type) => {
      if (checkedFilters[type].length === 0) return null; // Không hiển thị nếu không có giá trị
      return (
        <div key={type} style={{ marginBottom: "16px" }}>
          <strong>{titles[type]}</strong>
          <div>
            {checkedFilters[type].map((value) => (
              <Tag
                closable
                onClose={() => handleRemoveFilter(type, value)}
                key={`${type}-${value}`}
                style={{ marginBottom: "8px", fontSize: "15px" }}
              >
                {value}
              </Tag>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="navbar" style={{ padding: "20px" }}>
      <Divider orientation="center">Sort Products</Divider>
      <Select
        style={{ width: 260 }}
        placeholder="Sort by"
        onChange={handleSortChange}
      >
        <Option value="asc">Price: Low to High</Option>
        <Option value="desc">Price: High to Low</Option>
        <Option value="az">Name: A - Z</Option>
        <Option value="za">Name: Z - A</Option>
      </Select>

      <Divider orientation="center">Selected Filters</Divider>
      <div style={{ marginBottom: "16px" }}>{renderSelectedFilters()}</div>

      <Divider orientation="center">Filter Products</Divider>
      <Row gutter={[16, 16]}>
        {brands.length > 1 ? (
          <Col span={24}>
            <Button
              style={{ fontWeight: "bold", borderRadius: 20 }}
              block
              onClick={() => toggleFilter("brands")}
            >
              THƯƠNG HIỆU
            </Button>
            {visibleFilter === "brands" &&
              renderCheckboxGroup(
                brands.map((brand) => ({ label: brand, value: brand })),
                "brands"
              )}
          </Col>
        ) : (
          ""
        )}

        <Col span={24}>
          <Button
            style={{ fontWeight: "bold", borderRadius: 20 }}
            block
            onClick={() => toggleFilter("categories")}
          >
            LOẠI SẢN PHẨM
          </Button>
          {visibleFilter === "categories" &&
            renderCheckboxGroup(
              categories.map((category) => ({
                label: category.name,
                value: category.id,
              })),
              "categories"
            )}
        </Col>

        <Col span={24}>
          <Button
            style={{ fontWeight: "bold", borderRadius: 20 }}
            block
            onClick={() => toggleFilter("colors")}
          >
            MÀU SẮC
          </Button>
          {visibleFilter === "colors" &&
            renderCheckboxGroup(
              colors.map((color) => ({ label: color, value: color })),
              "colors"
            )}
        </Col>

        <Col span={24}>
          <Button
            style={{ fontWeight: "bold", borderRadius: 20 }}
            block
            onClick={() => toggleFilter("sizes")}
          >
            KÍCH THƯỚC
          </Button>
          {visibleFilter === "sizes" &&
            renderCheckboxGroup(
              sizes.map((size) => ({ label: size, value: size })),
              "sizes"
            )}
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
