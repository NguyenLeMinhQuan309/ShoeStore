import { useState, useEffect } from "react";
import { Button, Card, Typography, notification } from "antd";
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
  };

  return (
    <div className="product-management-container">
      <Title level={2} className="product-management-title">
        Product Management
      </Title>
      <Button
        type="primary"
        onClick={() => {
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
        />
      </Card>
    </div>
  );
};

export default ProductManagement;
