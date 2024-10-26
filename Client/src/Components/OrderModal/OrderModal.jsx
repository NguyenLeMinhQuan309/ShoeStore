import React, { useState, useEffect } from "react";
import { Modal, List, Typography, Button, Input, notification } from "antd";
import "./OrderModal.css";
import OrderSummary from "../OrderSummary/OrderSummary";
import StatusModal from "../StatusModal/StatusModal";
const { Title } = Typography;

const OrderModal = ({
  isVisible,
  handleClose,
  cartItems,
  setCartItems,
  totalPrice,
  user,
  onOrderSuccess,
}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderId, setOrderId] = useState(null); // Thêm state để lưu orderId
  const [transid, setTransid] = useState("");
  const [paid, setPaid] = useState(false);
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
      const addressString = `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

      const addressResponse = await fetch(
        `http://localhost:3000/address/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address,
          }),
        }
      );

      if (!addressResponse.ok) {
        console.error("Error saving address:", addressResponse.statusText);
        return null;
      }

      const orderResponse = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user ? user.email : "Chưa đăng nhập",
          name: user.name,
          phone: user.phone,
          product: cartItems,
          total: totalPrice,
          address: addressString,
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrderId(orderData.order.id);
        setOrderDetails(orderData.order); // Still set order details
        setShowOrderSummary(true);
        handleClose(); // Close the order modal
        // Call API to clear the cart
        await fetch(`http://localhost:3000/cart/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });
        setCartItems([]);
        return orderData.order.id; // Return orderId directly
      } else {
        console.error("Error saving order:", orderResponse.statusText);
        notification.error({
          message: "Lỗi khi đặt hàng",
          description: "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
        return null;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
      return null;
    }
  };

  const handlePayment = async () => {
    const orderId = await handleSubmit(); // Wait for handleSubmit and retrieve orderId

    if (!orderId) {
      notification.error({
        message: "Lỗi đơn hàng",
        description: "Đơn hàng chưa được tạo thành công. Vui lòng thử lại.",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          order_id: orderId, // Use orderId directly
          item: cartItems,
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

  const handleStatus = async (transid) => {
    if (!transid) {
      notification.error({
        message: "Lỗi đơn hàng",
        // description: "Đơn hàng chưa được tạo thành công. Vui lòng thử lại.",
      });
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/payment/${transid}", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const paymentData = await response.json();
        const paymentUrl = paymentData.order_url; // Adjust this based on your backend response structure
        window.open(paymentUrl, "_blank"); // Redirect to ZaloPay payment page in a new tab
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

  return (
    <div>
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
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onClick={handlePayment}
          >
            Zalo Pay
          </Button>
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onClick={handleSubmit}
          >
            Thanh toán khi nhận hàng
          </Button>
        </div>
      </Modal>
      {/* Hiển thị modal đơn hàng */}
      <OrderSummary
        isVisible={showOrderSummary}
        handleClose={() => setShowOrderSummary(false)}
        orderId={orderId} // Truyền orderId vào
        user={user}
        address={address}
        paid={paid}
        setPaid={setPaid}
      />
      <StatusModal
        isVisible={showStatusModal}
        handleClose={() => setShowStatusModal(false)}
        transid={transid}
        setPaid={setPaid}
      />
    </div>
  );
};

export default OrderModal;
