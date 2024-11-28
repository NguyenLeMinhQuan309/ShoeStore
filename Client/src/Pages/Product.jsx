import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Css/main.css";
import { useSearch } from "../Context/SearchContext"; // Adjust the path accordingly
import Navbar from "../Components/Navbar/Navbar";
import ProductItem from "../Components/ProductItem/ProductItem";

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
  "Cam",
];

const ProductComponent = () => {
  const { searchTerm } = useSearch(); // Get the search term from context
  const [searchParams] = useSearchParams(); // Đọc query params từ URL
  const gender = searchParams.get("gender"); // Lấy giá trị giới tính từ URL
  const brand = searchParams.get("brand");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    brand: brand ? brand : "",
    color: "",
    size: "",
    gender: gender === "male" ? 1 : gender === "female" ? 2 : "",
  });

  const BRANDS = brand
    ? [brand]
    : [
        "Adidas",
        "Hoka",
        "Nike",
        "Columbia",
        "Skechers",
        "On Running",
        "Saucony",
        "New Balance",
      ];
  const SIZES =
    gender === "male"
      ? [39, 40, 41, 42, 43, 44]
      : gender === "female"
      ? [36, 37, 38, 39, 40]
      : [36, 37, 38, 39, 40, 41, 42, 43, 44]; // Define available sizes

  useEffect(() => {
    setSelectedFilters((prev) => ({
      ...prev,
      gender: gender === "male" ? 1 : gender === "female" ? 2 : "", // Cập nhật filter giới tính
    }));
    console.log("gender:", selectedFilters);
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [selectedFilters, searchTerm]);

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
    const { category, brand, color, size, gender } = selectedFilters;
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
    if (gender) {
      query.push(`gender=${gender}`);
    }

    const queryString = query.length ? `?${query.join("&")}` : "";

    try {
      const response = await axios.get(
        queryString
          ? `http://localhost:3000/shoe/filterproducts${queryString}`
          : "http://localhost:3000/shoe/getShoes"
      );
      console.log(response.data);

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
      sortedProducts = [...products].sort((a, b) => {
        // Lấy giá cần so sánh
        const priceA =
          a.discountedColors?.length > 0
            ? a.discountedColors[0].finalPrice
            : a.images[0]?.price || 0;

        const priceB =
          b.discountedColors?.length > 0
            ? b.discountedColors[0].finalPrice
            : b.images[0]?.price || 0;

        return priceA - priceB; // Sắp xếp tăng dần
      });
    } else if (sortType === "desc") {
      sortedProducts = [...products].sort((a, b) => {
        // Lấy giá cần so sánh
        const priceA =
          a.discountedColors?.length > 0
            ? a.discountedColors[0].finalPrice
            : a.images[0]?.price || 0;

        const priceB =
          b.discountedColors?.length > 0
            ? b.discountedColors[0].finalPrice
            : b.images[0]?.price || 0;

        return priceB - priceA; // Sắp xếp giảm dần
      });
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
