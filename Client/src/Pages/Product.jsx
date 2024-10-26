import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Css/main.css";
import { useSearch } from "../Context/SearchContext"; // Adjust the path accordingly
import Navbar from "../Components/Navbar/Navbar";
import ProductItem from "../Components/ProductItem/ProductItem";

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
  "Xanh Dương",
  "Xám",
  "Đen",
  "Trắng",
  "Đỏ",
  "Vàng",
  "Xanh Lá",
  "Xanh Navy",
  "Tím",
  "Đa sắc",
];

const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44]; // Define available sizes

const ProductComponent = () => {
  const { searchTerm } = useSearch(); // Get the search term from context
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    brand: "",
    color: "",
    size: "",
  });

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          axios.get("http://localhost:3000/category/getAll"),
          axios.get("http://localhost:3000/brand/getAll"),
        ]);
        setCategories(categoriesResponse.data);
        // Assuming you want to use fetched brands instead of hardcoded ones
        // setBrands(brandsResponse.data);
      } catch (error) {
        console.error("Error fetching categories or brands: ", error);
      }
    };

    fetchCategoriesAndBrands();
  }, []);

  // Fetch products based on filters and search term
  const applyFilters = async () => {
    const { category, brand, color, size } = selectedFilters;
    const query = [];

    if (category) {
      query.push(`category=${category}`);
    }
    if (brand) {
      query.push(`brand=${brand}`);
    }
    if (color) {
      query.push(`color=${color}`);
    }
    if (size) {
      query.push(`size=${size}`);
    }

    const queryString = query.length ? `?${query.join("&")}` : "";

    try {
      const response = await axios.get(
        queryString
          ? `http://localhost:3000/shoe/filterproducts${queryString}`
          : "http://localhost:3000/shoe/getShoes"
      );

      // Filter products based on the search term
      const filteredProducts = response.data.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  // Fetch initial products
  useEffect(() => {
    applyFilters(); // Apply filters initially and when they change
  }, [selectedFilters, searchTerm]); // Add searchTerm to dependencies

  // Update category filter
  const handleFilterChange = (category) => {
    setSelectedFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
    }));
  };

  // Update brand filter
  const handleBrandChange = (brand) => {
    setSelectedFilters((prev) => ({
      ...prev,
      brand: prev.brand === brand ? "" : brand,
    }));
  };

  // Update color filter
  const handleColorChange = (color) => {
    setSelectedFilters((prev) => ({
      ...prev,
      color: prev.color === color ? "" : color,
    }));
  };

  // Update size filter
  const handleSizeChange = (size) => {
    setSelectedFilters((prev) => ({
      ...prev,
      size: prev.size === size ? "" : size,
    }));
  };

  // Sort products
  const handleSortChange = (sortType) => {
    let sortedProducts;
    if (sortType === "asc") {
      sortedProducts = [...products].sort((a, b) => a.price - b.price);
    } else if (sortType === "desc") {
      sortedProducts = [...products].sort((a, b) => b.price - a.price);
    } else if (sortType === "az") {
      sortedProducts = [...products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (sortType === "za") {
      sortedProducts = [...products].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }
    setProducts(sortedProducts);
  };

  return (
    <div className="main">
      <div className="container">
        <Navbar
          onFilterChange={handleFilterChange}
          onBrandChange={handleBrandChange}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onSortChange={handleSortChange}
          categories={categories}
          brands={BRANDS}
          colors={COLORS}
          sizes={SIZES}
        />
        <ProductItem products={products} colors={selectedFilters.color} />
      </div>
    </div>
  );
};

export default ProductComponent;
