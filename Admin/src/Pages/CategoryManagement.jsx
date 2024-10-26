import { useState, useEffect } from "react";
import { Button, Card, Typography, notification } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import CategoryTable from "../components/CategoryTable/CategoryTable";
import AddCategoryModal from "../components/AddCategoryModal/AddCategoryModal";
import BrandTable from "../components/BrandTable/BrandTable";
import AddBrandModal from "../components/AddBrandModal/AddBrandModal";
import "./css/CategoryManagement.css";

const { Title } = Typography;

const CategoryAndBrandComponent = () => {
  const [view, setView] = useState("category");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newItem, setNewItem] = useState({ id: "", name: "" });
  const [showPopup, setShowPopup] = useState(false);

  // Fetch data based on the selected view
  useEffect(() => {
    if (view === "category") {
      axios
        .get("http://localhost:3000/category/getAll")
        .then((response) => setCategories(response.data))
        .catch((error) => console.error("Error fetching categories!", error));
    } else {
      axios
        .get("http://localhost:3000/brand/getAll")
        .then((response) => setBrands(response.data))
        .catch((error) => console.error("Error fetching brands!", error));
    }
  }, [view]);

  // Add new category or brand based on selected view
  const addItem = () => {
    if (!newItem.id || !newItem.name) {
      notification.error({
        message: "Error",
        description: "All required fields must be filled correctly.",
      });
      return;
    }

    const url =
      view === "category"
        ? "http://localhost:3000/category/create"
        : "http://localhost:3000/brand/create";

    axios
      .post(url, newItem)
      .then((response) => {
        const addedItem = response.data[view];
        console.log(response.data);
        if (addedItem) {
          if (view === "category") {
            setCategories((prev) => [...prev, addedItem]);
          } else {
            setBrands((prev) => [...prev, addedItem]);
          }
          setShowPopup(false);
          setNewItem({ id: "", name: "" });
          notification.success({
            message: "Success",
            description: `${
              view === "category" ? "Category" : "Brand"
            } added successfully!`,
          });
        } else {
          notification.error({
            message: "Error",
            description: `Failed to add ${view}. No data returned.`,
          });
        }
      })
      .catch((error) => {
        console.error(`Error adding ${view}!`, error);
        notification.error({
          message: "Error",
          description: `Failed to add ${view}.`,
        });
      });
  };

  // Delete category or brand based on selected view
  const deleteItem = (id) => {
    const url =
      view === "category"
        ? `http://localhost:3000/category/delete/${id}`
        : `http://localhost:3000/brand/delete/${id}`;

    axios
      .delete(url)
      .then(() => {
        if (view === "category") {
          setCategories((prev) =>
            prev.filter((category) => category.id !== id)
          );
        } else {
          setBrands((prev) => prev.filter((brand) => brand.id !== id));
        }
        notification.success({
          message: "Success",
          description: `${
            view === "category" ? "Category" : "Brand"
          } deleted successfully!`,
        });
      })
      .catch((error) => {
        console.error(`Error deleting ${view}!`, error);
        notification.error({
          message: "Error",
          description: `Failed to delete ${view}.`,
        });
      });
  };

  return (
    <div className="category-management-container">
      <Title level={2} className="category-management-title">
        {view === "category" ? "Category Management" : "Brand Management"}
      </Title>
      <div className="toggle-buttons">
        <Button
          type={view === "category" ? "primary" : "default"}
          onClick={() => setView("category")}
        >
          Manage Categories
        </Button>
        <Button
          type={view === "brand" ? "primary" : "default"}
          onClick={() => setView("brand")}
        >
          Manage Brands
        </Button>
      </div>
      <Button
        type="primary"
        onClick={() => {
          setNewItem({ id: "", name: "" });
          setShowPopup(true);
        }}
        icon={<PlusOutlined />}
        className="category-management-add-button"
      >
        {view === "category" ? "Add Category" : "Add Brand"}
      </Button>
      {view === "category" ? (
        <AddCategoryModal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          newCategory={newItem}
          setNewCategory={setNewItem}
          addCategory={addItem}
        />
      ) : (
        <AddBrandModal
          showPopup={showPopup}
          setShowPopup={setShowPopup}
          newBrand={newItem}
          setNewBrand={setNewItem}
          addBrand={addItem}
        />
      )}
      <Card>
        {view === "category" ? (
          <CategoryTable categories={categories} onDelete={deleteItem} />
        ) : (
          <BrandTable brands={brands} onDelete={deleteItem} />
        )}
      </Card>
    </div>
  );
};

export default CategoryAndBrandComponent;
