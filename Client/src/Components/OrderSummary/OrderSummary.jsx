// OrderSummary.js
import React, { useState, useEffect } from "react";
import { Modal, List, Typography, Button, notification } from "antd";
//import "./OrderSummary.css"; // Tạo một file CSS nếu cần
const { Title } = Typography;

const OrderSummary = ({ isVisible, handleClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/order/${orderId}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data); // Lưu thông tin đơn hàng
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tải thông tin đơn hàng.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ.",
        });
      }
    };

    if (isVisible) {
      fetchOrderDetails(); // Gọi API khi modal hiển thị
    }
  }, [isVisible, orderId]);

  if (!orderDetails) {
    return null; // Hoặc có thể hiển thị loading nếu muốn
  }

  return (
    <Modal visible={isVisible} onCancel={handleClose} footer={null}>
      <Title level={4}>Thông tin đơn hàng</Title>
      <List
        bordered
        dataSource={orderDetails.product}
        renderItem={(item) => (
          <List.Item>
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                marginRight: "10px",
              }}
            />
            <span>{item.name}</span>
            <span>
              {item.color} / size: {item.size}
            </span>
            <span>
              {item.price} VND x {item.quantity}
            </span>
          </List.Item>
        )}
      />
      <Title level={4} style={{ textAlign: "right" }}>
        Tổng tiền: {orderDetails.total} VND
      </Title>
      <Button type="primary" onClick={handleClose}>
        Đóng
      </Button>
    </Modal>
  );
};

export default OrderSummary;
