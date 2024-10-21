import React, { useState } from "react";
import { Rate, Form, Input, Button, Modal, List, Typography } from "antd";

const { TextArea } = Input;
const { Title, Text } = Typography;

const RatingComponent = ({ reviews, onRatingSubmit }) => {
  const [userRating, setUserRating] = useState(0);
  const [userTitle, setUserTitle] = useState(""); // State to store title
  const [userComment, setUserComment] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Sort reviews by rating in descending order and get the top 5
  const topFiveReviews = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

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
    onRatingSubmit(userRating, userTitle, userComment); // Pass the title and comment
    setUserRating(0);
    setUserTitle(""); // Reset title
    setUserComment("");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <Title level={4}>Đánh giá sản phẩm:</Title>
      <Rate value={userRating} onChange={handleRatingChange} />
      <Form
        style={{
          marginTop: "20px",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        onFinish={handleSubmit}
      >
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

      {/* Display top 5 highest rating reviews */}
      <div style={{ marginTop: "20px" }}>
        <Title level={5}>5 đánh giá cao nhất:</Title>
        {topFiveReviews.map((review) => (
          <div key={review.id} style={{ marginBottom: "10px" }}>
            <Rate disabled defaultValue={review.rating} />
            <Title level={5}>{review.title}</Title> {/* Display title */}
            <Text>"{review.comment}"</Text> - {review.name}{" "}
            {/* Show reviewer's name */}
          </div>
        ))}
      </div>

      {/* Button to show modal with all reviews */}
      <Button type="link" style={{ marginTop: "10px" }} onClick={showModal}>
        Xem thêm
      </Button>

      {/* Modal to display all reviews */}
      <Modal
        title="Tất cả đánh giá"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={reviews}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Rate disabled defaultValue={item.rating} />}
                description={
                  <>
                    <strong>{item.title}</strong> {/* Display title */}
                    <br />"{item.comment}" - {item.name}{" "}
                    {/* Show reviewer's name */}
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default RatingComponent;
