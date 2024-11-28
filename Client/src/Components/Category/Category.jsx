import React from "react";
import { Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const brands = [
  {
    name: "Adidas",
    link: "Adidas",
    logo: "src/assets/brandLogo/adidaslogo.jpg",
  },
  {
    name: "Nike",
    link: "Nike",
    logo: "src/assets/brandLogo/nikelogo.jpg",
  },
  {
    name: "Hoka",
    link: "Hoka",
    logo: "src/assets/brandLogo/hokalogo.png",
  },
  {
    name: "NewBalance",
    link: "New Balance",
    logo: "src/assets/brandLogo/newbalancelogo.png",
  },
];

const FeaturedBrands = () => {
  const navigate = useNavigate();

  const handleButtonClick = (brand) => {
    navigate(`/product?brand=${encodeURIComponent(brand)}`); // Điều hướng React Router
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ marginBottom: 10 }}>Thương hiệu nổi bật</h1>
      <Row gutter={[16, 16]} justify="center">
        {brands.map((brand) => (
          <Col key={brand.name}>
            <Button
              style={{
                width: 150,
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                border: "1px solid #d9d9d9",
              }}
              onClick={() => handleButtonClick(brand.link)}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            </Button>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default FeaturedBrands;
