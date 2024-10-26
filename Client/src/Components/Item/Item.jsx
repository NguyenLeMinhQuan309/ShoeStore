import React from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./Item.css";

const ProductItem = ({ product, colors }) => {
  const navigate = useNavigate(); // Hook to navigate to a new route

  // Find the first matching color in the colors array
  const matchingColor = colors
    ? product.images
        .map((image) => image.color)
        .find((color) => colors.includes(color))
    : null; // If colors is undefined, set matchingColor to null

  // Determine the image URL based on whether a matching color was found or not
  const imageUrl = matchingColor
    ? product.images.find((image) => image.color === matchingColor)
        ?.imageUrls[0] || ""
    : product.images[0]?.imageUrls[0] || ""; // Fallback to the first image's URL if matchingColor is not found

  const handleClick = () => {
    // Navigate to the product page with the product's ID and matching color
    if (matchingColor) {
      navigate(
        `/product/${product.id}?color=${encodeURIComponent(
          matchingColor
        )}&?name=${encodeURIComponent(product.name)}`
      );
    } else {
      // Navigate to the product page without color if no matching color found
      navigate(
        `/product/${product.id}?name=${encodeURIComponent(product.name)}`
      );
    }
  };

  return (
    <Card
      className="item"
      hoverable
      cover={<img alt={product.name} src={imageUrl} />}
      onClick={handleClick} // Handle product click
      style={{ backgroundColor: "#efebea" }}
    >
      <h3>
        {product.name} - {matchingColor || product.images[0].color}
      </h3>
      <p>{product.brand}</p>
      <span style={{ fontSize: 20 }}>{product.price} VND</span>
    </Card>
  );
};

export default ProductItem;
