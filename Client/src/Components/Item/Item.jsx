import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Item.css";

const ProductItem = ({ product }) => {
  const navigate = useNavigate(); // Hook to navigate to a new route

  const imageUrl =
    product.images.length > 0 ? product.images[0].imageUrls[0] : "";

  const handleClick = () => {
    navigate(`/product/${product.id}`); // Navigate to the product page with the product's ID
  };

  return (
    <Card
      className="item"
      hoverable
      cover={<img alt={product.name} src={imageUrl} />}
      onClick={handleClick} // Handle product click
      style={{ backgroundColor: "#efebea" }}
    >
      <h3>{product.name}</h3>
      <p>{product.brand}</p>
      <span style={{ fontSize: 20 }}>{product.price} VND</span>
    </Card>
  );
};

export default ProductItem;
