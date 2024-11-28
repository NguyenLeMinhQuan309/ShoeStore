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
import StatusModal from "../StatusModal/StatusModal";
const { Step } = Steps;

const OrderSummary = ({ isVisible, handleClose, orderId }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state for order details
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [transid, setTransid] = useState("");
  const [paid, setPaid] = useState(false);

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

    if (isVisible) {
      fetchOrderDetails();
      changePaid();
    }
  }, [isVisible, orderId, paid]);

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
    if (status === "Đã hủy") {
      return -1; // Special case for canceled orders
    }
    switch (status) {
      case "Đã giao":
        return 3;
      case "Đang giao":
        return 2;
      case "Đang chuẩn bị hàng":
        return 1;
      case "Đã duyệt":
      case "Chờ duyệt":
        return 0;
      default:
        return 0; // Default for unknown statuses
    }
  };

  const currentStep = getStatusStep(orderDetails.status || "Chờ duyệt");

  const handlePayment = async () => {
    try {
      console.log(orderDetails);
      const response = await fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          amount: orderDetails.total,
          order_id: orderId, // Use orderId directly
          item: orderDetails.product,
        }),
      });

      if (response.ok) {
        const paymentData = await response.json();
        const paymentUrl = paymentData.order_url; // Adjust this based on your backend response structure
        window.open(paymentUrl, "_blank"); // Redirect to ZaloPay payment page in a new tab
        console.log("transid" + paymentData.app_trans_id);
        setTransid(paymentData.app_trans_id);
        setShowStatusModal(true);
      } else {
        notification.error({
          message: "Lỗi khi tạo thanh toán",
          description: "Không thể kết nối đến ZaloPay. Vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error("Error initiating ZaloPay payment:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
    }
  };
  const updateInventory = async () => {
    try {
      // Thực hiện tất cả các yêu cầu cập nhật kho song song
      const updateRequests = orderDetails.product.map((item) =>
        fetch("http://localhost:3000/shoe/updateQuantity", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.id, // ID sản phẩm
            color: item.color, // Màu sắc
            size: Number(item.size), // Size giày
            quantity: item.quantity, // Số lượng mua
            action: true,
          }),
        })
      );

      const responses = await Promise.all(updateRequests);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating inventory:", errorData.message);
          notification.error({
            message: "Lỗi cập nhật tồn kho",
            description: errorData.message,
          });
        }
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
    }
  };

  const handleCancelOrder = () => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn hủy đơn hàng này?",
      content: "Đơn hàng sẽ không thể phục hồi sau khi hủy.",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        setIsCancelling(true);
        try {
          const response = await fetch(
            `http://localhost:3000/order/cancel-request/${orderId}`,
            { method: "POST" }
          );

          if (response.ok) {
            notification.success({
              message: "Thành công",
              description: "Đơn hàng của bạn đã được hủy.",
            });
            await fetchOrderDetails();
            // Cập nhật tồn kho
            await updateInventory();
          } else {
            const errorData = await response.json();
            notification.error({
              message: "Lỗi",
              description: errorData.message || "Không thể hủy đơn hàng.",
            });
          }
        } catch (error) {
          console.error("Error canceling order:", error);
          notification.error({
            message: "Lỗi kết nối",
            description: "Không thể kết nối đến máy chủ.",
          });
        }
        setIsCancelling(false);
      },
    });
  };

  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  const formatDate = (isoDate) => {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const tax = (orderDetails.total - 30000) * 0.1;
  const ship = formatNumber(30000);
  return (
    <div>
      <Modal visible={isVisible} onCancel={handleClose} footer={null}>
        <Title level={4}>Thông tin đơn hàng</Title>
        <div>
          <Text strong>Người nhận:</Text> {orderDetails.name}
        </div>
        <div>
          <Text strong>Số điện thoại:</Text> {orderDetails.phone}
        </div>
        <div>
          <Text strong>Địa chỉ:</Text> {orderDetails.address}
        </div>
        <div>
          <Text strong>Hình thức thanh toán: </Text>
          {orderDetails.paymenttype}
        </div>
        <div>
          <Text strong>Thanh toán: </Text>
          {orderDetails.paid ? "Đã thanh toán" : "Chưa thanh toán"}
        </div>
        <div>
          <Text strong>Ngày đặt: </Text>
          {formatDate(orderDetails.date)}
        </div>
        {orderDetails.status === "Đã giao" ? (
          <div>
            <Text strong>Ngày giao: </Text>
            {formatDate(orderDetails.shipdate)}
          </div>
        ) : (
          ""
        )}
        <Steps
          current={currentStep}
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          {orderDetails.status === "Đã hủy" ? (
            <Step title="Đã hủy" />
          ) : (
            <>
              <Step
                title={
                  orderDetails.status === "Đã duyệt" ? "Đã duyệt" : "Chờ duyệt"
                }
              />
              <Step title="Đang chuẩn bị hàng" />
              <Step title="Đang giao" />
              <Step title="Đã giao" />
            </>
          )}
        </Steps>

        <List
          bordered
          dataSource={orderDetails.product}
          renderItem={(item, index) => (
            <List.Item key={`${item.id}-${item.size}-${item.color}-${index}`}>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                {item.finalPrice !== item.price && (
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                    }}
                  >
                    {formatNumber(item.price)} VND
                  </span>
                )}
                <span>
                  {formatNumber(item.finalPrice)} VND x {item.quantity}
                </span>
              </div>
            </List.Item>
          )}
        />
        <div style={{ textAlign: "right" }}>
          <span>Tiền ship: {formatNumber(30000)} VND </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span>Tiền thuế (10%): {formatNumber(tax)} VND</span>
        </div>
        <Title level={4} style={{ textAlign: "right" }}>
          Tổng tiền: {formatNumber(orderDetails.total)} VND
        </Title>

        {(orderDetails.status === "Chờ duyệt" ||
          orderDetails.status === "Đã duyệt" ||
          orderDetails.status === "Đang chuẩn bị hàng") &&
          orderDetails.status !== "Đã hủy" && // Ensure it's not "Đã hủy"
          !(orderDetails.paymenttype === "Zalo Pay" && orderDetails.paid) && ( // Not already paid with Zalo Pay
            <Button
              type="danger"
              onClick={handleCancelOrder}
              loading={isCancelling}
              style={{ marginBottom: "20px" }}
            >
              Hủy đơn hàng
            </Button>
          )}

        {orderDetails.status === "Đã duyệt" && !orderDetails.paid && (
          <Button
            type="primary"
            onClick={handlePayment}
            style={{ marginBottom: "20px", marginRight: "10px" }}
          >
            Thanh toán
          </Button>
        )}

        <Button onClick={handleClose}>Đóng</Button>
      </Modal>
      <StatusModal
        isVisible={showStatusModal}
        handleClose={() => setShowStatusModal(false)}
        transid={transid}
        setPaid={setPaid}
      />
    </div>
  );
};

export default OrderSummary;
