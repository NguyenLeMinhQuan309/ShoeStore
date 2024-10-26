import React, { useState, useEffect } from "react";
import "./Popular.css"; // Nếu bạn cần CSS cho NewSection
import ProductItem from "../Item/Item";
import { Button } from "antd";
import { CaretRightFilled, CaretLeftFilled } from "@ant-design/icons";
const Popular = () => {
  const [startIndex, setStartIndex] = useState(0); // Chỉ mục sản phẩm bắt đầu
  const [productsPerPage, setProductsPerPage] = useState(7); // Number of products per page
  const products = [
    {
      name: "Giày Thể Thao",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.000.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
    {
      name: "Giày Chạy Bộ",
      image: "link_tới_ảnh_sản_phẩm",
      price: "1.200.000",
      brandLogo: "link_tới_logo_thương_hiệu",
    },
  ];
  const updateProductsPerPage = () => {
    const width = window.innerWidth;
    if (width < 600) {
      setProductsPerPage(1);
    } else if (width < 790) {
      setProductsPerPage(2);
    } else if (width < 1050) {
      setProductsPerPage(3);
    } else if (width < 1280) {
      setProductsPerPage(4);
    } else if (width < 1500) {
      setProductsPerPage(5);
    } else if (width < 1700) {
      setProductsPerPage(6);
    } else {
      setProductsPerPage(7);
    }
  };

  // useEffect to handle component mount and unmount
  useEffect(() => {
    updateProductsPerPage(); // Initial check for products per page
    window.addEventListener("resize", updateProductsPerPage); // Add resize event

    return () => {
      window.removeEventListener("resize", updateProductsPerPage); // Cleanup event listener
    };
  }, []);

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
      <h1>Phổ biến</h1>
      <div className="group-item">
        <Button
          type="primary"
          shape="circle"
          onClick={handlePrev}
          disabled={startIndex === 0}
          icon={<CaretLeftFilled />}
        />

        {currentProducts.map((product, index) => (
          <ProductItem key={index} product={product} />
        ))}

        <Button
          type="primary"
          shape="circle"
          onClick={handleNext}
          disabled={startIndex + productsPerPage >= products.length}
          icon={<CaretRightFilled />}
        />
      </div>
    </div>
  );
};

export default Popular;
