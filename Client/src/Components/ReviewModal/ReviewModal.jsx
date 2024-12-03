import React, { useState, useEffect } from "react";
import { Modal, List, Rate, Input, Button, Select, Typography } from "antd";
const { Text } = Typography;
const { Option } = Select;

const ReviewsModal = ({ isModalVisible, handleCancel, reviews }) => {
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [selectedRating, setSelectedRating] = useState(""); // Change null to empty string
  const [searchQuery, setSearchQuery] = useState("");
  //   console.log(reviews);
  const handleRatingFilter = (value) => {
    setSelectedRating(value);
    if (value) {
      setFilteredReviews(reviews.filter((review) => review.rating === value));
    } else {
      setFilteredReviews(reviews); // Reset filter
    }
  };
  useEffect(() => {
    if (!selectedRating) handleRatingFilter("");
  });

  // Handle searching by title or comment
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = reviews.filter(
      (review) =>
        review.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        review.comment.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredReviews(filtered);
  };

  return (
    <Modal
      title="Tất cả đánh giá"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      {/* Filters Section */}
      <div style={{ marginBottom: "20px" }}>
        {/* Rating Filter */}
        <Select
          style={{ width: 120, marginRight: "10px" }}
          placeholder="Filter by Rating"
          value={selectedRating}
          onChange={handleRatingFilter}
        >
          <Option value="">All Ratings</Option>{" "}
          {/* Empty string for the default option */}
          <Option value={5}>5 stars</Option>
          <Option value={4}>4 stars</Option>
          <Option value={3}>3 stars</Option>
          <Option value={2}>2 stars</Option>
          <Option value={1}>1 star</Option>
        </Select>

        {/* Search by Title/Comment */}
        <Input
          placeholder="Search reviews"
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
      </div>

      {/* Reviews List */}
      <List
        itemLayout="horizontal"
        dataSource={filteredReviews}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                // Rating Section
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* Display Rating */}
                  <Rate
                    disabled
                    value={item.rating}
                    style={{ marginRight: "10px" }}
                  />
                </div>
              }
              description={
                <div>
                  {/* Display User Avatar and Name */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <img
                      src={
                        item.userId.image
                          ? item.userId.image
                          : "http://localhost:3000/user/uploads/userImage/default_avatar.png"
                      }
                      alt={item.userId.name}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span>{item.userId.name}</span>
                  </div>

                  {/* Display Review Title and Comment */}
                  <div>
                    <strong>{item.title}</strong>
                    <br />
                    <Text>"{item.comment}"</Text>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ReviewsModal;
