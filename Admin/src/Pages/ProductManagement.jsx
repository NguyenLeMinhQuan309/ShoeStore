import { useState, useEffect } from "react";
import { Button, Card, Typography, notification, Modal } from "antd";
import axios from "axios";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ProductTable from "../components/ProductTable/ProductTable";
import AddProductModal from "../components/AddProductModal/AddProductModal";
import DiscountModal from "../components/DiscountModal/DiscountModal";
import * as XLSX from "xlsx";
import "./css/ProductManagement.css";

const { Title } = Typography;

const CATEGORIES = [
  "depquainang",
  "depxongon",
  "giaybongro",
  "giaychaybo",
  "giaydabong",
  "giaydibo",
  "giaysandal",
  "giaysneakers",
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

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    category: "",
    brand: "",

    gender: 0,
    description: "",
    images: [
      {
        imageUrls: [],
        color: "",
        price: 0,
        stock: [{ size: "", quantity: 0 }],
      },
    ],
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false); // State để hiển thị Discount Modal
  const [editingProduct, setEditingProduct] = useState(null);
  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3000/shoe/getShoes")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  const addProduct = (product) => {
    if (
      !product.name ||
      !product.category ||
      !product.brand ||
      product.gender <= 0
    ) {
      notification.error({
        message: "Error",
        description: "All required fields must be filled correctly.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("gender", product.gender);
    formData.append("description", product.description);

    if (Array.isArray(product.images)) {
      product.images.forEach((imageObj) => {
        if (
          imageObj &&
          imageObj.imageUrls &&
          imageObj.imageUrls.length > 0 &&
          imageObj.price > 0 // Kiểm tra giá của từng màu
        ) {
          formData.append("color", imageObj.color);
          formData.append("price", imageObj.price); // Thêm giá theo màu

          imageObj.imageUrls.forEach((file) => {
            if (file && file.originFileObj) {
              formData.append("images", file.originFileObj);
            }
          });

          imageObj.stock.forEach((stockItem) => {
            formData.append(
              "stock",
              JSON.stringify({
                color: imageObj.color,
                size: stockItem.size,
                quantity: stockItem.quantity,
              })
            );
          });
        } else {
          notification.error({
            message: "Error",
            description: `Please provide a valid price for color ${imageObj.color}.`,
          });
          return;
        }
      });
    }
    if (editingProduct) {
      axios
        .put(`http://localhost:3000/shoe/update/${product.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const updatedProduct = response.data;

          // Cập nhật danh sách sản phẩm
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            )
          );
          setShowPopup(false); // Đóng popup
          // Hiển thị thông báo thành công
          notification.success({
            message: "Success",
            description: "Product updated successfully!",
          });
        })
        .catch((error) => {
          notification.error({
            message: "Error",
            description: "Failed to update the product. Please try again.",
          });
          console.error(error);
        });
    } else {
      axios
        .post("http://localhost:3000/shoe/addShoes", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          setProducts([...products, response.data]);
          setShowPopup(false);
          setNewProduct({
            name: "",
            category: "",
            brand: "",
            gender: 0,
            description: "",
            images: [
              {
                imageUrls: [],
                color: "",
                price: 0,
                stock: [{ size: "", quantity: 0 }],
              },
            ],
          });
          notification.success({
            message: "Success",
            description: "Product added successfully!",
          });
        })
        .catch((error) => {
          console.error("There was an error!", error);
          notification.error({
            message: "Error",
            description: "Failed to add product.",
          });
        });
    }
  };
  const handleEdit = (product) => {
    setEditingProduct(true);
    setNewProduct({
      id: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      gender: product.gender,
      description: product.description,
      images: product.images,
    });
    setShowPopup(true);
  };
  const deleteShoe = async (shoeId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      onOk: async () => {
        try {
          const response = await axios.delete(
            `http://localhost:3000/shoe/delete/${shoeId}`
          );
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== shoeId)
          );
          console.log(response.data.message);
          notification.success({
            message: "Success",
            description: "Product deleted successfully!",
          });
        } catch (error) {
          console.error(
            "Error deleting shoe:",
            error.response?.data?.message || error.message
          );
          notification.error({
            message: "Error",
            description: "Failed to delete the product. Please try again.",
          });
        }
      },
      onCancel() {
        console.log("Delete action canceled.");
      },
    });
  };
  return (
    <div className="product-management-container">
      <Title level={2} className="product-management-title">
        Product Management
      </Title>
      <Button
        type="primary"
        onClick={() => {
          setEditingProduct(null);
          setNewProduct({
            name: "",
            category: "",
            brand: "",
            gender: 0,
            description: "",
            images: [
              {
                imageUrls: [],
                color: "",
                price: 0,
                stock: [{ size: "", quantity: 0 }],
              },
            ],
          });
          setShowPopup(true);
        }}
        icon={<PlusOutlined />}
        className="product-management-add-button"
      >
        Add Product
      </Button>
      <Button
        type="primary"
        className="product-management-add-button"
        onClick={() => setShowDiscountModal(true)} // Mở Modal Khuyến Mãi
      >
        Khuyến Mãi
      </Button>
      <AddProductModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        addProduct={addProduct}
        isEditing={editingProduct !== null}
      />
      <DiscountModal
        isVisible={showDiscountModal}
        onClose={() => setShowDiscountModal(false)} // Đóng Modal Khuyến Mãi
      />
      <Card>
        <ProductTable
          products={products}
          setProducts={setProducts}
          categories={CATEGORIES}
          brands={BRANDS}
          onEdit={handleEdit}
          onDelete={deleteShoe}
        />
      </Card>
    </div>
  );
};

export default ProductManagement;
