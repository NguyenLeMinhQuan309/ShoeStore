import { Table, Button, Input, Select } from "antd";
import { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete, brands, categories }) => {
  const [editingKey, setEditingKey] = useState(null); // Track the product being edited
  const [stockValues, setStockValues] = useState({}); // Track stock values for editing
  const [selectedBrand, setSelectedBrand] = useState(null); // Track selected brand
  const [selectedCategories, setSelectedCategories] = useState(null); // Track selected categories
  const [searchKeyword, setSearchKeyword] = useState(""); // Track the search keyword

  // Handle Edit button click
  const handleEdit = (record) => {
    setEditingKey(record._id); // Set the product being edited
    setStockValues({ ...stockValues, [record._id]: record.stock }); // Initialize stock value
  };

  // Handle Save button click
  const handleSave = (record) => {
    onEdit({ ...record, stock: stockValues[record._id] }); // Save the new stock value
    setEditingKey(null); // Exit editing mode
  };

  // Handle stock input change
  const handleStockChange = (e, record) => {
    setStockValues({ ...stockValues, [record._id]: e.target.value });
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value); // Set the selected brand for sorting
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories(value); // Set the selected categories for sorting
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
  };

  // Filter products based on brand, category, and search keyword
  const filteredProducts = products
    .filter((product) => !selectedBrand || product.brand === selectedBrand)
    .filter(
      (product) =>
        !selectedCategories || product.category === selectedCategories
    )
    .filter((product) => product.name.toLowerCase().includes(searchKeyword)); // Filter based on search keyword

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id), // Sort alphabetically
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (images) => (
        <div className="product-management-image-list">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.imageUrls[0]} // Display the first image for each color
              alt={`Product Image - ${img.color}`}
              className="product-management-image"
              style={{ width: "50px", height: "50px", marginRight: "10px" }} // Adjust size as needed
            />
          ))}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sort alphabetically
    },
    {
      title: (
        <div>
          Brand
          <Select
            placeholder="Select Brand"
            style={{ width: 120, marginLeft: 8 }}
            onChange={handleBrandChange}
            allowClear
          >
            {brands.map((brand) => (
              <Select.Option key={brand} value={brand}>
                {brand}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      dataIndex: "brand",
    },
    {
      title: (
        <div>
          Category
          <Select
            placeholder="Select Categories"
            style={{ width: 150, marginLeft: 8 }}
            onChange={handleCategoryChange}
            allowClear
          >
            {categories.map((category) => (
              <Select.Option key={category} value={category}>
                {category}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
      dataIndex: "category",
    },
    {
      title: "Size",
      dataIndex: "size",
      render: (sizes) => sizes.join(", "), // Add a comma between each size
    },
    {
      title: "Color",
      dataIndex: "images",
      render: (images) => images.map((img) => img.color).join(" / "), // Display colors separated by '/'
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price, // Sort numerically
      render: (price) => `$${price.toFixed(2)}`, // Format as currency
    },
    {
      title: "Stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock, // Sort numerically
      render: (stock, record) =>
        editingKey === record._id ? (
          <div>
            <Input
              value={stockValues[record._id]}
              onChange={(e) => handleStockChange(e, record)}
              style={{ width: "80px", marginRight: "10px" }}
            />
            <Button onClick={() => handleSave(record)}>Save</Button>
          </div>
        ) : (
          <div>
            <span>{stock}</span>
            <Button
              onClick={() => handleEdit(record)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </Button>
          </div>
        ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => onDelete(record._id)} // Call onDelete with the product ID
            style={{ marginRight: "10px" }}
            danger // To give it a red appearance
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Input.Search
        placeholder="Search product by name"
        onChange={handleSearchChange}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="_id" // Ensure that _id is unique for each product
        className="product-management-table"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        tableLayout="fixed"
      />
    </>
  );
};

export default ProductTable;
