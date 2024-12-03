import React, { useState } from "react";
import {
  Rate,
  Form,
  Input,
  Button,
  Modal,
  List,
  Typography,
  Progress,
} from "antd";
import ReviewsModal from "../ReviewModal/ReviewModal";
const { TextArea } = Input;
const { Title, Text } = Typography;

const RatingComponent = ({ reviews, onRatingSubmit }) => {
  const [userRating, setUserRating] = useState(0);
  const [userTitle, setUserTitle] = useState("");
  const [userComment, setUserComment] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews || 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((review) => review.rating === star).length
  );

  const handleRatingChange = (value) => {
    setUserRating(value);
  };

  const handleTitleChange = (e) => {
    setUserTitle(e.target.value);
  };

  const handleCommentChange = (e) => {
    setUserComment(e.target.value);
  };

  const handleSubmit = () => {
    onRatingSubmit(userRating, userTitle, userComment);
    setUserRating(0);
    setUserTitle("");
    setUserComment("");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{ marginTop: "40px", textAlign: "center", placeItems: "center" }}
    >
      <Title level={4}>Đánh giá sản phẩm:</Title>

      {/* Tổng quan đánh giá */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "20px",
          marginBottom: "20px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        {/* Đánh giá trung bình */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <Title level={1} style={{ margin: 0, color: "#fadb14" }}>
            {averageRating.toFixed(1)}
          </Title>
          <Rate
            disabled
            allowHalf
            value={averageRating}
            style={{ marginTop: "10px", fontSize: "24px" }}
          />
          <Text style={{ display: "block", marginTop: "10px" }}>
            {totalReviews} đánh giá
          </Text>
        </div>

        {/* Thanh hiển thị số lượng đánh giá theo sao */}
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div
              key={star}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Text style={{ width: "50px" }}>{star} sao</Text>
              <Progress
                percent={(ratingCounts[index] / totalReviews) * 100 || 0}
                strokeColor="#fadb14"
                showInfo={false}
                style={{ flex: 1, margin: "0 10px" }}
              />
              <Text>{ratingCounts[index]}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Form đánh giá */}
      <Form
        style={{
          marginTop: "20px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onFinish={handleSubmit}
      >
        {" "}
        Đánh giá <Rate value={userRating} onChange={handleRatingChange} /> cho
        sản phẩm này
        <Form.Item>
          <Input
            placeholder="Tiêu đề đánh giá..."
            value={userTitle}
            onChange={handleTitleChange}
          />
        </Form.Item>
        <Form.Item>
          <TextArea
            rows={4}
            placeholder="Viết đánh giá của bạn..."
            value={userComment}
            onChange={handleCommentChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
      <Title level={5}>5 đánh giá cao nhất:</Title>
      {/* Hiển thị top 5 đánh giá */}
      <div
        style={{
          marginTop: "20px",
          maxWidth: 600,
          width: 600,
        }}
      >
        {reviews
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5)
          .map((review) => (
            <div
              key={`${review.id}-${review.userId._id}`}
              style={{ marginBottom: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column", // Stack items vertically
                  alignItems: "flex-start", // Align items to the start of the container
                }}
              >
                {/* Rating Section */}
                <div style={{ marginBottom: "10px" }}>
                  <Rate
                    disabled
                    style={{ fontSize: 12 }}
                    defaultValue={review.rating}
                  />
                </div>

                {/* Image and Name Section */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center", // Align image and name horizontally
                    marginBottom: "10px",
                  }}
                >
                  <img
                    src={
                      review.userId.image
                        ? review.userId.image
                        : "http://localhost:3000/user/uploads/userImage/default_avatar.png"
                    } // Assuming userId.image holds the avatar URL
                    alt={review.userId.name}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    {review.userId.name}
                  </Title>
                </div>

                {/* Review Title and Comment Section */}
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {review.title}
                  </Title>
                  <Text>"{review.comment}"</Text>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Nút xem tất cả đánh giá */}
      <Button type="link" style={{ marginTop: "10px" }} onClick={showModal}>
        Xem thêm
      </Button>

      {/* Modal hiển thị tất cả đánh giá */}
      <ReviewsModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        reviews={reviews}
      />
    </div>
  );
};

export default RatingComponent;
