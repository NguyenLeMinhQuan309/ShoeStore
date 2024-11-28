import { Table, Button, Input, Select } from "antd";
import { useState } from "react";
import ProductDetailsModal from "../ProductDetailModal/ProductDetailModal";

const ProductTable = ({
  products,
  setProducts,
  onDelete,
  brands,
  categories,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [modalProduct, setModalProduct] = useState(null); // Track product to display in modal
  const [selectedBrand, setSelectedBrand] = useState(null); // Track selected brand
  const [selectedCategories, setSelectedCategories] = useState(null); // Track selected categories
  const [searchKeyword, setSearchKeyword] = useState(""); // Track the search keyword

  const showDetailsModal = (record) => {
    setModalProduct(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setModalProduct(null);
  };

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategories(value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value.toLowerCase());
  };

  const filteredProducts = products
    .filter((product) => !selectedBrand || product.brand === selectedBrand)
    .filter(
      (product) =>
        !selectedCategories || product.category === selectedCategories
    )
    .filter((product) => product.name.toLowerCase().includes(searchKeyword));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Images",
      dataIndex: "images",
      render: (images) => (
        <div className="product-management-image-list">
          {images.map((img, index) => (
            <img
              key={index}
              src={img.imageUrls[0]}
              alt={`Product Image - ${img.color}`}
              className="product-management-image"
              style={{ width: "50px", height: "50px", marginRight: "10px" }}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender) => (gender === 1 ? "Nam" : "Nữ"), // Convert numeric value to text
      filters: [
        { text: "All", value: null }, // Default "All" option
        { text: "Nam", value: 1 },
        { text: "Nữ", value: 2 },
      ],
      onFilter: (value, record) => value === null || record.gender === value, // Filter logic
      sorter: (a, b) => a.gender - b.gender, // Sorting logic
      sortDirections: ["ascend", "descend"],
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
      title: "Color / Price",
      dataIndex: "images",
      render: (images) =>
        images
          .map((img) => `${img.color}: ${formatNumber(img.price)} vnd`)
          .join(" / "),
    },

    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <Button
            onClick={() => showDetailsModal(record)}
            style={{ marginRight: "10px" }}
          >
            Details
          </Button>
          <Button onClick={() => onDelete(record._id)} danger>
            Delete
          </Button>
        </div>
      ),
    },
  ];
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
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
        rowKey="_id"
        className="product-management-table"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        tableLayout="fixed"
      />
      <ProductDetailsModal
        visible={isModalVisible}
        product={modalProduct}
        setProduct={setProducts}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ProductTable;
