import React, { useState } from "react";
import { Checkbox, Select, Divider, Row, Col } from "antd";
import "./Navbar.css"; // You can style further if needed

const { Option } = Select;

const Navbar = ({
  brands,
  categories,
  colors,
  onFilterChange,
  onSortChange,
}) => {
  const [checkedCategories, setCheckedCategories] = useState({
    brands: [],
    categories: [],
    colors: [],
  });

  // Handle checkbox change
  const handleCheckboxChange = (categoryType, checkedValues) => {
    setCheckedCategories((prevState) => {
      const updatedState = {
        ...prevState,
        [categoryType]: checkedValues,
      };
      onFilterChange(updatedState); // Call onFilterChange with updated state
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
            value={checkedCategories.brands}
            onChange={(checkedValues) =>
              handleCheckboxChange("brands", checkedValues)
            }
          />
        </Col>

        <Col span={24}>
          <h4>Shoe Types</h4>
          <Checkbox.Group
            options={categories.map((type) => ({
              label: type.display,
              value: type.value,
            }))}
            value={checkedCategories.categories}
            onChange={(checkedValues) =>
              handleCheckboxChange("categories", checkedValues)
            }
          />
        </Col>

        <Col span={24}>
          <h4>Colors</h4>
          <Checkbox.Group
            options={colors.map((color) => ({ label: color, value: color }))}
            value={checkedCategories.colors}
            onChange={(checkedValues) =>
              handleCheckboxChange("colors", checkedValues)
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
