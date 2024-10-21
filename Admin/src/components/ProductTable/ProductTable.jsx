import { Table, Button, Input } from "antd";
import { useState } from "react";

const ProductTable = ({ products, onEdit }) => {
  const [editingKey, setEditingKey] = useState(null); // Track the product being edited
  const [stockValues, setStockValues] = useState({}); // Track stock values for editing

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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
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
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => category.join(", "), // Add a comma between each size
    },
    {
      title: "Brand",
      dataIndex: "brand",
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
      render: (price) => `$${price.toFixed(2)}`, // Format as currency
    },
    {
      title: "Stock",
      dataIndex: "stock",
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
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="_id" // Ensure that _id is unique for each product
      className="product-management-table"
      pagination={{ pageSize: 5 }}
      scroll={{ x: true }}
      tableLayout="fixed"
    />
  );
};

export default ProductTable;
