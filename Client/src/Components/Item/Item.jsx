import React, { useEffect, useState } from "react";
import { Card, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Item.css";

const ProductItem = ({ product, colors }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0); // Đánh giá sản phẩm
  const [totalReview, setTotalReview] = useState(0); // Tổng số đánh giá
  const [finalPrice, setFinalPrice] = useState(null); // Giá sau giảm giá
  const [originalPrice, setOriginalPrice] = useState(null); // Giá gốc
  const [discountPercentage, setDiscountPercentage] = useState(0); // Tỷ lệ giảm giá
  const [matchingColor, setMatchingColor] = useState(null); // Màu đang được hiển thị

  useEffect(() => {
    const determineColor = () => {
      let selectedColor = null;
      let discountedColor = null;

      // Nếu có màu trong colors, ưu tiên màu trong colors
      if (Array.isArray(colors) && colors.length > 0) {
        selectedColor = product.images.find((image) =>
          colors.includes(image.color)
        );
      }

      // Nếu không có màu trong colors, kiểm tra màu giảm giá
      if (!selectedColor && product.discountedColors?.length > 0) {
        discountedColor = product.discountedColors[0]; // Chọn màu giảm giá đầu tiên
        selectedColor = product.images.find(
          (image) => image.color === discountedColor.color
        );
      }

      // Nếu không tìm thấy màu hợp lệ, chọn màu mặc định
      if (!selectedColor) {
        selectedColor = product.images[0];
      }

      // Kiểm tra xem màu được chọn có giảm giá không
      if (product.discountedColors?.length > 0) {
        discountedColor = product.discountedColors.find(
          (discount) => discount.color === selectedColor.color
        );
      }

      // Cập nhật giá và thông tin giảm giá
      setMatchingColor(selectedColor.color);
      if (discountedColor) {
        setOriginalPrice(discountedColor.originalPrice);
        setFinalPrice(discountedColor.finalPrice);
        setDiscountPercentage(discountedColor.discountPercentage);
      } else {
        setOriginalPrice(selectedColor.price);
        setFinalPrice(selectedColor.price);
        setDiscountPercentage(0); // Không có giảm giá
      }
    };

    determineColor();
  }, [colors, product]);

  useEffect(() => {
    if (!product.id) return;

    const fetchRating = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/review/rating",
          {
            id: product.id,
          }
        );
        setRating(response.data.averageStars || 0);
        setTotalReview(response.data.totalReviews || 0);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };

    fetchRating();
  }, [product.id]);

  // Xác định hình ảnh, giá theo màu được chọn
  const selectedImage = product.images?.find(
    (image) => image.color === matchingColor
  );
  const imageUrl =
    selectedImage?.imageUrls?.[0] || product.images[0]?.imageUrls?.[0] || "";
  const price = selectedImage?.price || product.images[0]?.price || 0;

  const handleClick = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("name", product.name);
    if (matchingColor) queryParams.append("color", matchingColor);
    navigate(`/product/${product.id}?${queryParams.toString()}`);
    window.location.reload();
  };

  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);

  return (
    <Card
      className="item"
      hoverable
      cover={<img alt={product.name} src={imageUrl} />}
      onClick={handleClick}
      style={{ backgroundColor: "#efebea" }}
    >
      <h3>
        {product.name} - {matchingColor || product.images[0]?.color}
      </h3>
      <p>{product.brand}</p>
      <div style={{ marginTop: 3 }}>
        <Rate disabled value={rating} style={{ fontSize: 14 }} />
        <span style={{ marginLeft: "10px" }}>({totalReview})</span>
      </div>
      <div style={{ fontSize: 20 }}>
        <span style={{ color: discountPercentage > 0 ? "red" : "black" }}>
          {formatNumber(finalPrice)} VND
        </span>
        {discountPercentage > 0 && (
          <span
            style={{
              marginLeft: "10px",
              textDecoration: "line-through",
              color: "gray",
              fontSize: 14,
            }}
          >
            {formatNumber(originalPrice)} VND
          </span>
        )}
      </div>
    </Card>
  );
};

export default ProductItem;
