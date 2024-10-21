import React, { useState, useEffect } from "react";
import { Modal, List, Typography, Button, Input, notification } from "antd";
import "./OrderModal.css";
import OrderSummary from "../OrderSummary/OrderSummary";
const { Title } = Typography;

const OrderModal = ({
  isVisible,
  handleClose,
  cartItems,
  totalPrice,
  user,
}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [orderId, setOrderId] = useState(null); // Thêm state để lưu orderId
  const [address, setAddress] = useState({
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    const fetchAddress = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/address/${user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setAddress({
              number: data.number || "",
              street: data.street || "",
              ward: data.ward || "",
              district: data.district || "",
              city: data.city || "",
            });
          } else {
            console.error("Error fetching address:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    if (isVisible) {
      fetchAddress();
    }
  }, [isVisible, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Kiểm tra xem địa chỉ đã thay đổi hay chưa để cập nhật
      const addressString = `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

      const addressResponse = await fetch(
        `http://localhost:3000/address/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: addressString, // Gửi địa chỉ dưới dạng chuỗi
          }),
        }
      );

      if (!addressResponse.ok) {
        console.error("Error saving address:", addressResponse.statusText);
      }

      // Lưu đơn hàng
      const orderResponse = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user ? user.email : "Chưa đăng nhập",
          product: cartItems,
          total: totalPrice,
          address: addressString,
        }),
      });

      if (orderResponse.ok) {
        notification.success({
          message: "Đặt hàng thành công",
          description: "Đơn hàng của bạn đã được gửi đi.",
        });
        const orderData = await orderResponse.json(); // Nhận dữ liệu đơn hàng
        console.log(orderData);
        setOrderId(orderData.order._id); // Lưu ID của đơn hàng
        setOrderDetails(orderData.order); // Lưu thông tin đơn hàng

        setShowOrderSummary(true); // Hiện modal đơn hàng
        handleClose(); // Đóng modal đặt hàng
      } else {
        console.error("Error saving order:", orderResponse.statusText);
        notification.error({
          message: "Lỗi khi đặt hàng",
          description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
      }
    } catch (error) {
      console.error("Error saving order:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      onCancel={handleClose}
      footer={null} // Hide footer buttons if not needed
    >
      <Title level={4}>Thông tin người đặt</Title>
      <p>Email: {user ? user.email : "Chưa đăng nhập"}</p>
      <p>Tên: {user ? user.name : "Chưa đăng nhập"}</p>
      <p>Số điện thoại: {user ? user.phone : "Chưa đăng nhập"}</p>
      <Title level={4}>Địa chỉ giao hàng</Title>
      <Input
        placeholder="Số nhà"
        name="number"
        value={address.number}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Tên đường"
        name="street"
        value={address.street}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Phường"
        name="ward"
        value={address.ward}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Quận"
        name="district"
        value={address.district}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Input
        placeholder="Thành phố"
        name="city"
        value={address.city}
        onChange={handleInputChange}
        style={{ marginBottom: "10px" }}
      />
      <Title level={4}>Thông tin sản phẩm</Title>
      <List
        bordered
        dataSource={cartItems}
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
        Tổng tiền: {totalPrice} VND
      </Title>
      <Title level={4}>Phương thức thanh toán</Title>
      <p>Chọn phương thức thanh toán của bạn</p>
      <div className="paymentbutton">
        <Button type="primary" style={{ margin: "5px" }}>
          Thẻ tín dụng
        </Button>
        <Button type="primary" style={{ margin: "5px" }}>
          Momo
        </Button>
        <Button type="primary" style={{ margin: "5px" }} onClick={handleSubmit}>
          Thanh toán khi nhận hàng
        </Button>
      </div>
      {/* Hiển thị modal đơn hàng */}
      <OrderSummary
        isVisible={showOrderSummary}
        handleClose={() => setShowOrderSummary(false)}
        orderId={orderId} // Truyền orderId vào
      />
    </Modal>
  );
};

export default OrderModal;
