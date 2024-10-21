import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Css/main.css";
import Navbar from "../Components/Navbar/Navbar";
import ProductItem from "../Components/ProductItem/ProductItem";

// Define fixed categories, brands, and colors
const CATEGORIES = [
  { display: "Dép quai ngang", value: "depquainang" },
  { display: "Dép xỏ ngón", value: "depxongon" },
  { display: "Giày bóng rổ", value: "giaybongro" },
  { display: "Giày chạy bộ", value: "giaychaybo" },
  { display: "Giày đá bóng", value: "giaydabong" },
  { display: "Giày đi bộ", value: "giaydibo" },
  { display: "Giày sandal", value: "giaysandal" },
  { display: "Giày sneakers", value: "giaysneakers" },
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

const COLORS = [
  "Xanh dương",
  "Xám",
  "Đen",
  "Trắng",
  "Đỏ",
  "Vàng",
  "Xanh lá",
  "Tím",
];

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    color: [],
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/shoe/getShoes")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filteredProducts
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const applyFilters = () => {
    let filtered = products;
    console.log(filtered);
    // Apply category filter
    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter(
        (product) => selectedFilters.category.includes(product.category.value) // Ensure this matches the structure
      );
    }

    // Apply brand filter
    if (selectedFilters.brand.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.brand.includes(product.brand)
      );
    }

    // Apply color filter
    if (selectedFilters.color.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFilters.color.includes(product.color)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (category) => {
    setSelectedFilters((prev) => {
      const newCategories = prev.category.includes(category)
        ? prev.category.filter((cat) => cat !== category) // Remove category if already selected
        : [...prev.category, category]; // Add category if not selected
      return { ...prev, category: newCategories };
    });
  };

  const handleBrandChange = (brand) => {
    setSelectedFilters((prev) => {
      const newBrands = prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand) // Remove brand if already selected
        : [...prev.brand, brand]; // Add brand if not selected
      return { ...prev, brand: newBrands };
    });
  };

  const handleColorChange = (color) => {
    setSelectedFilters((prev) => {
      const newColors = prev.color.includes(color)
        ? prev.color.filter((c) => c !== color) // Remove color if already selected
        : [...prev.color, color]; // Add color if not selected
      return { ...prev, color: newColors };
    });
  };

  const handleSortChange = (sortType) => {
    let sortedProducts;
    if (sortType === "asc") {
      sortedProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
    } else if (sortType === "desc") {
      sortedProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
    } else if (sortType === "az") {
      sortedProducts = [...filteredProducts].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sortType === "za") {
      sortedProducts = [...filteredProducts].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }
    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    applyFilters(); // Apply filters whenever selectedFilters changes
  }, [selectedFilters]);

  return (
    <div className="main">
      <div className="container">
        <Navbar
          onFilterChange={handleFilterChange}
          onBrandChange={handleBrandChange}
          onColorChange={handleColorChange}
          onSortChange={handleSortChange}
          categories={CATEGORIES}
          brands={BRANDS}
          colors={COLORS} // Pass colors to the Navbar
        />
        <ProductItem
          products={filteredProducts.length > 0 ? filteredProducts : products}
          selectedCategories={selectedFilters.category}
          selectedBrands={selectedFilters.brand}
          selectedColors={selectedFilters.color}
        />
      </div>
    </div>
  );
};

export default ProductComponent;
