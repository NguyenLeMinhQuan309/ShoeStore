import React, { useState } from "react";
import { Checkbox, Select, Divider, Row, Col } from "antd";
import "./Navbar.css"; // You can style further if needed

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

  // Handle checkbox change for brands, categories, colors, and sizes
  const handleCheckboxChange = (type, checkedValues) => {
    const uniqueCheckedValues = [...new Set(checkedValues)];

    setCheckedFilters((prevState) => {
      const updatedState = {
        ...prevState,
        [type]: uniqueCheckedValues,
      };

      // Call the corresponding handler based on the type of category being changed
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

  // Handle sorting change
  const handleSortChange = (value) => {
    onSortChange(value);
  };

  return (
    <div className="navbar" style={{ padding: "20px" }}>
      <Divider orientation="left">Filter Products</Divider>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h4>Brands</h4>
          <Checkbox.Group
            options={brands.map((brand) => ({ label: brand, value: brand }))}
            value={checkedFilters.brands}
            onChange={(checkedValues) =>
              handleCheckboxChange("brands", checkedValues)
            }
          />
        </Col>

        <Col span={24}>
          <h4>Shoe Types</h4>
          <Checkbox.Group
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            value={checkedFilters.categories}
            onChange={(checkedValues) =>
              handleCheckboxChange("categories", checkedValues)
            }
          />
        </Col>

        <Col span={24}>
          <h4>Colors</h4>
          <Checkbox.Group
            options={colors.map((color) => ({ label: color, value: color }))}
            value={checkedFilters.colors}
            onChange={(checkedValues) =>
              handleCheckboxChange("colors", checkedValues)
            }
          />
        </Col>

        <Col span={24}>
          <h4>Sizes</h4>
          <Checkbox.Group
            options={sizes.map((size) => ({ label: size, value: size }))}
            value={checkedFilters.sizes}
            onChange={(checkedValues) =>
              handleCheckboxChange("sizes", checkedValues)
            }
          />
        </Col>
      </Row>

      <Divider orientation="left">Sort Products</Divider>
      <Select
        style={{ width: 200 }}
        placeholder="Sort by"
        onChange={handleSortChange}
      >
        <Option value="asc">Price: Low to High</Option>
        <Option value="desc">Price: High to Low</Option>
        <Option value="az">Name: A - Z</Option>
        <Option value="za">Name: Z - A</Option>
      </Select>
    </div>
  );
};

export default Navbar;
