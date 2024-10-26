import React, { useState, useEffect } from "react";
import {
  Modal,
  List,
  Typography,
  Button,
  notification,
  Steps,
  Spin,
} from "antd";
const { Title, Text } = Typography;
const { Step } = Steps;

const OrderSummary = ({
  isVisible,
  handleClose,
  orderId,
  user,
  paid,
  setPaid,
}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for order details

  useEffect(() => {
    const changePaid = async () => {
      if (paid) {
        try {
          const response = await fetch(
            `http://localhost:3000/order/${orderId}/paid`,
            { method: "PUT" }
          );
          if (response.ok) {
            setPaid(false);
          } else {
            console.error("Error changing paid status:", response.statusText);
          }
        } catch (error) {
          console.error("Error changing paid status:", error);
        }
      }
    };

    const fetchOrderDetails = async () => {
      setLoading(true); // Set loading true when fetching details
      try {
        const response = await fetch(
          `http://localhost:3000/order/getId/${orderId}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
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
      } finally {
        setLoading(false); // Set loading false after fetching
      }
    };

    if (isVisible) {
      fetchOrderDetails();
      changePaid();
    }
  }, [isVisible, orderId, paid, setPaid]);

  if (loading) {
    return (
      <Modal visible={isVisible} onCancel={handleClose} footer={null}>
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      </Modal>
    );
  }

  if (!orderDetails) {
    return null;
  }

  const getStatusStep = (status) => {
    switch (status) {
      case "Đã giao":
        return 3;
      case "Đang giao":
        return 2;
      case "Đang chuẩn bị hàng":
        return 1;
      case "Chờ duyệt":
      default:
        return 0;
    }
  };

  const currentStep = getStatusStep(orderDetails.status || "Chờ duyệt");

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(
        `http://localhost:3000/order/cancel-request/${orderId}`,
        { method: "POST" }
      );

      if (response.ok) {
        notification.success({
          message: "Thành công",
          description: "Yêu cầu hủy đơn hàng đã được gửi tới quản trị viên.",
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Không thể gửi yêu cầu hủy đơn hàng.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ.",
      });
    }
    setIsCancelling(false);
  };

  return (
    <Modal visible={isVisible} onCancel={handleClose} footer={null}>
      <Title level={4}>Thông tin đơn hàng</Title>
      <div>
        <Text strong>Người nhận:</Text> {user.name}
      </div>
      <div>
        <Text strong>Số điện thoại:</Text> {user.phone}
      </div>
      <div>
        <Text strong>Địa chỉ:</Text> {orderDetails.address}
      </div>
      <div>
        <Text strong>Thanh toán: </Text>
        {orderDetails.paid ? "Đã thanh toán" : "Chưa thanh toán"}
      </div>

      <Steps
        current={currentStep}
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <Step title="Chờ duyệt" />
        <Step title="Đang chuẩn bị hàng" />
        <Step title="Đang giao" />
        <Step title="Đã giao" />
      </Steps>

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

      {(orderDetails.status === "Chờ duyệt" ||
        orderDetails.status === "Đang chuẩn bị hàng") && (
        <Button
          type="danger"
          onClick={handleCancelOrder}
          loading={isCancelling}
          style={{ marginBottom: "20px" }}
        >
          Gửi yêu cầu hủy
        </Button>
      )}

      <Button onClick={handleClose}>Đóng</Button>
    </Modal>
  );
};

export default OrderSummary;
