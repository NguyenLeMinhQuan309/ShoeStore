import { useState, useEffect } from "react";
import { Button, Card, Typography, notification } from "antd"; // Import notification for user feedback
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import ProductTable from "../components/ProductTable/ProductTable";
import AddProductModal from "../components/AddProductModal/AddProductModal";
import "./css/ProductManagement.css";

const { Title } = Typography;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: [],
    brand: "",
    size: [],
    price: 0,
    description: "",
    stock: 0,
    images: [{ imageUrls: [], color: "" }], // Ensure at least one image object
  });

  const [showPopup, setShowPopup] = useState(false);

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3000/shoe/getShoes")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("There was an error!", error));
  }, []);

  // Add new product
  const addProduct = (product) => {
    console.log("Product to be added:", product); // Debugging
    if (
      !product.name ||
      !product.category.length ||
      !product.brand ||
      !product.size.length ||
      product.price <= 0 ||
      product.stock < 0
    ) {
      console.error("All required fields must be filled correctly.");
      notification.error({
        message: "Error",
        description: "All required fields must be filled correctly.",
      }); // Display error notification
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("brand", product.brand);
    formData.append("size", product.size);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("stock", product.stock);

    // Append each image with its corresponding color to the form data
    if (Array.isArray(product.images)) {
      product.images.forEach((imageObj) => {
        console.log("Image Object:", imageObj); // Debugging

        if (imageObj && imageObj.imageUrls && imageObj.imageUrls.length > 0) {
          formData.append("color", imageObj.color);
          imageObj.imageUrls.forEach((file) => {
            // Log the file before appending
            console.log("File to append:", file);
            if (file && file.originFileObj) {
              formData.append("images", file.originFileObj); // Append the original file object
            } else {
              console.warn("File originFileObj is undefined for:", file);
            }
          });
        } else {
          console.warn("Image object is not structured correctly:", imageObj);
        }
      });
    } else {
      console.error("Product images are not defined or not an array");
    }

    axios
      .post("http://localhost:3000/shoe/addShoes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setProducts([...products, response.data]);
        setShowPopup(false); // Close modal after adding
        setNewProduct({
          // Reset newProduct state
          name: "",
          category: [],
          brand: "",
          size: [],
          price: 0,
          description: "",
          stock: 0,
          images: [],
        });
        notification.success({
          message: "Success",
          description: "Product added successfully!",
        }); // Display success notification
      })
      .catch((error) => {
        console.error("There was an error!", error);
        notification.error({
          message: "Error",
          description: "Failed to add product.",
        }); // Display error notification
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
            category: [],
            brand: "",
            size: [],
            price: 0,
            description: "",
            stock: 0,
            images: [],
          });
          setShowPopup(true); // Show modal
        }}
        icon={<PlusOutlined />}
        className="product-management-add-button"
      >
        Add Product
      </Button>
      <AddProductModal
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        addProduct={addProduct}
      />
      <Card>
        <ProductTable products={products} />
      </Card>
    </div>
  );
};

export default ProductManagement;
