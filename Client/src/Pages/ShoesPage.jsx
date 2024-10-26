import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Button,
  Image,
  Typography,
  Rate,
  Form,
  Input,
  Modal,
  List,
  InputNumber,
  notification,
} from "antd";
import RatingComponent from "../Components/Rating/Rating";
const { Title, Text } = Typography;
const { TextArea } = Input;

const ShoesPage = ({ products }) => {
  const { id } = useParams();
  const location = useLocation(); // Get the location object
  const product = products.find((p) => p.id === id);
  const query = new URLSearchParams(location.search);
  const color = query.get("color"); // Get the color from the query string
  console.log(query);
  if (!product) {
    return <p>Product not found</p>;
  }

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3000/review/getAll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }), // Send the product ID to fetch related reviews
        });
        const data = await response.json();

        setReviews(data); // Ensure we set reviews only if it's an array

        console.log(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([]); // Set to an empty array on failure
      }
    };

    fetchReviews();
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  // Set the selected color index based on the URL color parameter
  useEffect(() => {
    if (color) {
      const matchingIndex = product.images.findIndex(
        (img) => img.color === color
      );
      if (matchingIndex !== -1) {
        setSelectedColorIndex(matchingIndex);
      }
    }
  }, [color, product.images]);

  const handleColorThumbnailClick = (index) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  };

  const handleImageThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleRatingSubmit = async (rating, title, comment) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.name || !user.email) {
      alert("You need to log in to submit a review.");
      return;
    }

    const name = user.name;
    const email = user.email;

    const newReview = {
      email,
      rating,
      title,
      comment,
      name, // Submit the name as well
      id: product.id, // Associate review with the product
    };

    try {
      const response = await fetch("http://localhost:3000/review/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        const data = await response.json();
        setReviews([...reviews, data.review]); // Add new review to local state
        alert("Review submitted successfully");
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user ? user.email : null;

    if (!email) {
      notification.warning({
        message: "User Not Logged In",
        description: "You need to log in to add items to your cart.",
        placement: "topRight",
      });
      return;
    }

    if (!selectedSize) {
      notification.warning({
        message: "Size Not Selected",
        description: "Please select a size before adding to the cart.",
        placement: "topRight",
      });
      return;
    }

    const selectedColor = product.images[selectedColorIndex].color;

    const cartItem = {
      email,
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor, // Add the selected color to the cart
      total: product.price * quantity,
      image: product.images[selectedColorIndex].imageUrls[selectedImageIndex],
    };

    try {
      const response = await fetch("http://localhost:3000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.reload(); // Reload the page after adding to cart
        notification.success({
          message: "Item Added",
          description: data.message,
          placement: "topRight",
        });
      } else {
        console.error("Failed to add item:", data);
        notification.error({
          message: "Add to Cart Failed",
          description:
            data.message ||
            "An error occurred while adding the item to the cart.",
          placement: "topRight",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "An unexpected error occurred.",
        placement: "topRight",
      });
    }
  };

  return (
    <div
      style={{
        padding: "0 100px",
        marginTop: "64px",
        margin: "64px 60px 0 60px",
      }}
    >
      <Row gutter={16}>
        <Col span={10}>
          <div style={{ marginBottom: "20px" }}>
            <Image
              alt={product.name}
              src={
                product.images[selectedColorIndex].imageUrls[selectedImageIndex]
              }
              style={{ borderRadius: "5px" }}
              width="100%"
            />
            <Row gutter={16} style={{ marginTop: "10px" }}>
              {product.images[selectedColorIndex].imageUrls.map(
                (url, index) => (
                  <Col span={4} key={index}>
                    <img
                      src={url}
                      alt={`Image ${index + 1} of $(
                        product.images[selectedColorIndex].color
                      )`}
                      onClick={() => handleImageThumbnailClick(index)}
                      style={{
                        width: "100%",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border:
                          selectedImageIndex === index
                            ? "2px solid blue"
                            : "none",
                      }}
                    />
                  </Col>
                )
              )}
            </Row>
          </div>
        </Col>
        <Col span={14}>
          <Card
            title={product.name}
            bordered={false}
            style={{ height: "100%" }}
          >
            <Text strong>Brand: </Text>
            <Text>{product.brand}</Text>
            <br />
            <Text strong>Price: </Text>
            <Text>{product.price} VND</Text>
            <h3 style={{ marginTop: "20px" }}>Available Colors:</h3>
            <Row gutter={8}>
              {product.images.map((img, colorIndex) => (
                <Col span={3} key={colorIndex} style={{ marginBottom: "10px" }}>
                  <img
                    src={img.imageUrls[0]}
                    alt={img.color}
                    onClick={() => handleColorThumbnailClick(colorIndex)}
                    style={{
                      cursor: "pointer",
                      width: "100%",
                      border:
                        selectedColorIndex === colorIndex
                          ? "2px solid blue"
                          : "none",
                      borderRadius: "5px",
                    }}
                  />
                </Col>
              ))}
            </Row>
            {/* Size Buttons */}
            <div style={{ marginTop: "20px" }}>
              <Text strong>Size: </Text>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {product.size.map((size) => (
                  <Button
                    key={size}
                    type={selectedSize === size ? "primary" : "default"}
                    onClick={() => setSelectedSize(size)}
                    style={{ borderRadius: "20px" }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
            {/* Quantity and Add to Cart Button */}
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <InputNumber
                min={1}
                max={product.stock}
                defaultValue={1}
                value={quantity}
                onChange={setQuantity}
              />
              <Button
                type="primary"
                style={{
                  borderRadius: "20px",
                  height: "40px",
                  backgroundColor: "#322a2a",
                }}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
            </div>
            <Text style={{ marginTop: "20px", display: "block" }}>
              {product.description}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Rating and Comment Section */}
      <RatingComponent reviews={reviews} onRatingSubmit={handleRatingSubmit} />
    </div>
  );
};

export default ShoesPage;
