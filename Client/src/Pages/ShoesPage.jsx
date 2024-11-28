import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Card,
  Button,
  Image,
  Typography,
  Rate,
  Input,
  InputNumber,
  notification,
} from "antd";
import RatingComponent from "../Components/Rating/Rating";
import Suggestions from "../Components/ShoesPageSuggest/Suggestion";
const { Title, Text } = Typography;
const { TextArea } = Input;

const ShoesPage = ({ products }) => {
  const { id } = useParams();
  const location = useLocation(); // Get the location object
  const product = products.find((p) => p.id === id);
  const query = new URLSearchParams(location.search);
  const hasTrackedView = useRef(false); // Prevent multiple tracking
  const color = query.get("color"); // Get the color from the query string
  // console.log(query);
  if (!product) {
    return <p>Product not found</p>;
  }
  // console.log(product);

  const price = color
    ? product.images?.find((image) => image.color === color)?.price || 0
    : product.images?.[0]?.price || 0;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [stockQuantity, setStockQuantity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0); // State to store the fetched rating
  const [totalReview, setTotalReview] = useState(0); // State to store the fetched rating
  const [finalPrice, setFinalPrice] = useState(price); // Initialize with the original price
  const [originalPrice, setOriginalPrice] = useState(price); // Initialize with the original price
  const [discountPercentage, setDiscountPercentage] = useState(0); // Store discount percentage
  const [discountDates, setDiscountDates] = useState({
    startDate: null,
    endDate: null,
  }); // Store discount dates
  useEffect(() => {
    const fetchInitialPrice = async () => {
      const initialColor = product.images[selectedColorIndex]?.color;
      if (initialColor) {
        await fetchPrice(initialColor);
      }
    };
    fetchInitialPrice();
  }, [product.id, selectedColorIndex]);

  const fetchPrice = async (color) => {
    try {
      const discountedColor = product.discountedColors?.find(
        (discount) => discount.color === color
      );

      if (discountedColor) {
        // Nếu có giảm giá cho màu này
        setFinalPrice(discountedColor.finalPrice);
        setOriginalPrice(discountedColor.originalPrice);
        setDiscountPercentage(discountedColor.discountPercentage);
        setDiscountDates({
          startDate: discountedColor.startDate,
          endDate: discountedColor.endDate,
        });
      } else {
        // Nếu không có giảm giá, sử dụng giá gốc của màu
        const selectedImage = product.images?.find(
          (image) => image.color === color
        );
        setFinalPrice(selectedImage?.price || 0);
        setOriginalPrice(selectedImage?.price || 0);
      }
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchReviewsAndRatings = async () => {
      try {
        // Fetch reviews for the product by ID
        const reviewResponse = await fetch(
          `http://localhost:3000/review/getbyId`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }), // Assuming id is the product ID
          }
        );

        if (!reviewResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const reviewsData = await reviewResponse.json();
        // console.log("Reviews data:", reviewsData); // You can check the whole data here

        // Fetch average rating and total reviews
        const ratingResponse = await axios.post(
          `http://localhost:3000/review/rating`,
          { id: product.id } // Assuming product.id is used to get the rating
        );

        // Set states
        setReviews(reviewsData); // Store reviews data in state
        setRating(ratingResponse.data.averageStars || 0); // Set average rating
        setTotalReview(ratingResponse.data.totalReviews || 0); // Set total reviews count
      } catch (error) {
        console.error("Failed to fetch data:", error);
        notification.error({
          message: "Error",
          description: "Failed to fetch reviews or ratings.",
        });
      } finally {
        setIsLoading(false); // Set loading state to false after fetching
      }
    };

    fetchReviewsAndRatings();
  }, [id, product.id]); // Ensure `id` and `product.id` are updated when the product changes

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

  useEffect(() => {
    if (!hasTrackedView.current && product) {
      trackProductView();
      hasTrackedView.current = true; // Mark view as tracked
    }
  }, [product]);

  const handleColorThumbnailClick = (index) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);

    const selectedColor = product.images[index].color;
    fetchPrice(selectedColor); // Fetch the price for the selected color
  };

  const handleImageThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleRatingSubmit = async (rating, title, comment) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.name || !user.email) {
      notification.error({
        message: "User Not Logged In.",
        description: "Bạn cần đăng nhập để đánh giá sản phẩm.",
      });
      return;
    }

    const userId = user._id;

    const newReview = {
      userId,
      rating,
      title,
      comment,
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
        notification.success({
          message: "Review submitted successfully",
        });
      } else {
        const data = await response.json();
        if (data.error && data.error === "Bạn đã đánh giá sản phẩm này rồi.") {
          notification.error({
            message: "Review Error",
            description: "Bạn đã đánh giá sản phẩm này rồi.",
          });
        } else {
          notification.error({
            message: "Error",
            description: "Failed to submit review.",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      notification.error({
        message: "Error",
        description: "Failed to submit review.",
      });
    }
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user ? user.email : null;

    if (!email) {
      notification.warning({
        message: "User Not Logged In",
        description: "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.",
        placement: "topRight",
      });
      return;
    }

    if (!selectedSize) {
      notification.warning({
        message: "Size Not Selected",
        description: "Vui lòng chọn size trước khi thêm sản phẩm vào giỏ hàng.",
        placement: "topRight",
      });
      return;
    }

    const selectedColor = product.images[selectedColorIndex].color;
    const selectedPrice = product.images[selectedColorIndex].price; // Lấy giá theo màu

    const cartItem = {
      email,
      id: product.id,
      name: product.name,
      price: originalPrice, // Sử dụng giá từ màu được chọn
      quantity,
      size: selectedSize,
      color: selectedColor, // Thêm màu vào giỏ hàng
      total: selectedPrice * quantity, // Tính tổng tiền theo giá đã chọn
      image: product.images[selectedColorIndex].imageUrls[selectedImageIndex], // Lấy hình ảnh theo màu
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

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const sizeStock = product.images[selectedColorIndex].stock.find(
      (stockItem) => stockItem.size === size
    );
    setStockQuantity(sizeStock ? sizeStock.quantity : null);
  };
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);

  const trackProductView = async () => {
    console.log("Tracking product view..."); // Thêm dòng này
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user ? user.email : null;

    if (!email) {
      console.warn("User not logged in, view tracking skipped.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/viewHistory/add", {
        email,
        id: product.id, // Use product.id to match the correct variable
      });
      console.log("Product view tracked successfully."); // In ra nếu request thành công
    } catch (error) {
      console.error("Error tracking product view:", error);
    }
  };

  return (
    <div>
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
                  product.images[selectedColorIndex].imageUrls[
                    selectedImageIndex
                  ]
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
              title={<span style={{ fontSize: "24px" }}>{product.name}</span>}
              bordered={false}
              style={{ height: "100%" }}
            >
              <div style={{ marginTop: 3 }}>
                <Rate disabled value={rating} style={{ fontSize: 14 }} />
                <span style={{ marginLeft: "10px" }}>
                  ({totalReview} đánh giá)
                </span>
              </div>
              <Text strong>Brand: </Text>
              <Text>{product.brand}</Text>
              <br />
              <Text strong style={{ color: "red", fontSize: "30px" }}>
                {formatNumber(finalPrice)} đ
              </Text>
              {originalPrice !== finalPrice && (
                <div style={{ marginTop: "10px" }}>
                  <Text
                    style={{ textDecoration: "line-through", color: "gray" }}
                  >
                    {formatNumber(originalPrice)} đ
                  </Text>
                  <br />
                  <Text style={{ color: "green" }}>
                    {discountPercentage}% off (Valid from{" "}
                    {discountDates.startDate
                      ? new Date(discountDates.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    to{" "}
                    {discountDates.endDate
                      ? new Date(discountDates.endDate).toLocaleDateString()
                      : "N/A"}
                    )
                  </Text>
                </div>
              )}

              <h3 style={{ marginTop: "20px" }}>Available Colors:</h3>
              <Row gutter={8}>
                {product.images.map((img, colorIndex) => (
                  <Col
                    span={3}
                    key={colorIndex}
                    style={{ marginBottom: "10px" }}
                  >
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
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  {product.images[selectedColorIndex].stock.map((stockItem) => (
                    <Button
                      key={stockItem.size}
                      type={
                        selectedSize === stockItem.size ? "primary" : "default"
                      }
                      onClick={() => handleSizeSelect(stockItem.size)}
                      style={{
                        borderRadius: "20px",
                        opacity: stockItem.quantity === 0 ? 0.5 : 1,
                        pointerEvents:
                          stockItem.quantity === 0 ? "none" : "auto",
                      }}
                    >
                      {stockItem.size}
                    </Button>
                  ))}
                </div>
              </div>
              {/* Display stock quantity below the size buttons */}
              {stockQuantity !== null && (
                <Text style={{ marginTop: "10px", display: "block" }}>
                  Available stock: {stockQuantity}
                </Text>
              )}
              {/* Quantity and Add to Cart Button */}
              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <InputNumber
                  min={1}
                  max={stockQuantity || 1} // Ensure it doesn't exceed available stock
                  defaultValue={1}
                  value={quantity}
                  onChange={setQuantity}
                />
                <Button
                  type="primary"
                  style={{
                    borderRadius: "20px",
                    height: "50px",
                    backgroundColor: "#322a2a",
                    fontSize: 18,
                  }}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || stockQuantity < 1} // Disable if no size or stock
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
        <RatingComponent
          reviews={reviews}
          onRatingSubmit={handleRatingSubmit}
        />
      </div>
      <Suggestions id={product.id} />
    </div>
  );
};

export default ShoesPage;
