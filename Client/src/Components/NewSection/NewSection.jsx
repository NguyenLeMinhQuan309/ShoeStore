import React, { useState, useEffect } from "react";
import "./NewSection.css"; // Nếu bạn cần CSS cho NewSection
import ProductItem from "../Item/Item";
import { Button } from "antd";
import { CaretRightFilled, CaretLeftFilled } from "@ant-design/icons";

const NewSection = () => {
  const [startIndex, setStartIndex] = useState(0); // Chỉ mục sản phẩm bắt đầu
  const [productsPerPage, setProductsPerPage] = useState(4); // Số sản phẩm trên mỗi trang
  const [products, setProducts] = useState([]); // State to store products from API

  // Function to update the number of products per page based on screen width
  const updateProductsPerPage = () => {
    const width = window.innerWidth;
    if (width < 790) {
      setProductsPerPage(1);
    } else if (width < 1000) {
      setProductsPerPage(2);
    } else if (width < 1400) {
      setProductsPerPage(3);
    } else if (width < 1600) {
      setProductsPerPage(4);
    } else {
      setProductsPerPage(5);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/shoe/getShoes"); // Replace with your API URL
      const data = await response.json();
      console.log(data);
      setProducts(data); // Assuming the API returns products in 'data.products'
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products on component mount and handle screen resize
  useEffect(() => {
    fetchProducts(); // Fetch products from API
    // updateProductsPerPage(); // Initial check for products per page
    // window.addEventListener("resize", updateProductsPerPage); // Add resize event listener

    // return () => {
    //   window.removeEventListener("resize", updateProductsPerPage); // Cleanup event listener
    // };
  }, []);

  // Get the current products to display based on pagination
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleNext = () => {
    if (startIndex + productsPerPage < products.length) {
      setStartIndex(startIndex + productsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - productsPerPage >= 0) {
      setStartIndex(startIndex - productsPerPage);
    }
  };

  return (
    <div className="newsection">
      <h1>Hàng mới về</h1>
      <div className="group-item">
        {/* <Button
          type="primary"
          shape="circle"
          onClick={handlePrev}
          disabled={startIndex === 0}
          icon={<CaretLeftFilled />}
        /> */}

        {currentProducts.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}

        {/* <Button
          type="primary"
          shape="circle"
          onClick={handleNext}
          disabled={startIndex + productsPerPage >= products.length}
          icon={<CaretRightFilled />}
        /> */}
      </div>
    </div>
  );
};

export default NewSection;
