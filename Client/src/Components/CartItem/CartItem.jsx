import React, { useState, useEffect } from "react";
import { Card, Button, List, Typography, notification } from "antd"; // Import notification
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OrderModal from "../OrderModal/OrderModal"; // Import the OrderModal component
import "./CartItem.css";

const { Title } = Typography;

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [finalPrice, setFinalPrice] = useState(null);
  const [originalPrice, setOriginalPrice] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const email = user ? user.email : null;
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/cart/getall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, [email]);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const finalTotalPrice = cartItems.reduce(
    (total, item) => total + item.finalPrice * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (total, item) => totalPrice - finalTotalPrice,
    0
  );

  const increaseQuantity = async (id, color, size) => {
    try {
      // Gọi API kiểm tra tồn kho
      const response = await fetch("http://localhost:3000/shoe/getQuantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, color, size }),
      });

      const { quantity: stockQuantity } = await response.json();

      // Lấy thông tin sản phẩm trong giỏ hàng
      const cartItem = cartItems.find(
        (item) => item.id === id && item.color === color && item.size === size
      );

      if (!cartItem) {
        notification.error({
          message: "Sản phẩm không tồn tại",
          description: "Không tìm thấy sản phẩm trong giỏ hàng.",
        });
        return;
      }

      // Kiểm tra số lượng
      if (cartItem.quantity >= stockQuantity) {
        notification.warning({
          message: "Vượt quá số lượng tồn kho",
          description: "Số lượng trong giỏ hàng đã đạt giới hạn tồn kho.",
        });
        return;
      }

      // Tăng số lượng trong giỏ hàng
      const updatedCart = cartItems.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCartItems(updatedCart);

      // Cập nhật số lượng trong cơ sở dữ liệu
      await updateCartQuantity(id, color, size, cartItem.quantity + 1);
    } catch (error) {
      console.error("Error increasing quantity:", error);
      notification.error({
        message: "Lỗi hệ thống",
        description: "Không thể tăng số lượng sản phẩm. Vui lòng thử lại sau.",
      });
    }
  };

  const decreaseQuantity = async (id, color, size) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id &&
      item.color === color &&
      item.size === size &&
      item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    // Update quantity in the database
    const updatedItem = updatedCart.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    if (updatedItem) {
      await updateCartQuantity(id, color, size, updatedItem.quantity);
    }
  };

  const removeItem = async (id, color, size) => {
    try {
      // Attempt to remove item from the database
      const response = await fetch(`http://localhost:3000/cart/deleteItem`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, color, size }),
      });

      if (response.ok) {
        setCartItems(
          cartItems.filter(
            (item) =>
              !(item.id === id && item.color === color && item.size === size)
          )
        );

        notification.success({
          message: "Xóa sản phẩm thành công",
          description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
        });
      } else {
        notification.error({
          message: "Xóa sản phẩm thất bại",
          description: "Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error removing item:", error);
      notification.error({
        message: "Xóa sản phẩm thất bại",
        description: "Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.",
      });
    }
  };

  const updateCartQuantity = async (id, color, size, quantity) => {
    try {
      await fetch(`http://localhost:3000/cart/update-quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, color, size, quantity }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Function to handle showing the modal
  const handleOrder = () => {
    if (cartItems.length === 0) {
      notification.warning({
        message: "Empty Cart",
        description: "Bạn không có sản phẩm nào trong giỏ hàng.",
      });
      return; // Ngừng nếu giỏ hàng rỗng
    }
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const clearCart = () => {
    setCartItems([]); // Xóa tất cả sản phẩm khỏi giỏ hàng
  };
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <Card style={{ width: "100%" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Giỏ hàng của bạn
      </Title>
      <List
        bordered
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item style={{ display: "flex" }}>
            <img
              src={item.image}
              alt={item.name}
              style={{ width: 100, marginRight: 10 }}
            />
            <span>{item.name}</span>
            <span>
              {item.color} / size: {item.size}
            </span>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                {item.discountPercentage > 0 && (
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
            </div>

            <div className="quantity">
              <Button
                onClick={() => decreaseQuantity(item.id, item.color, item.size)}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                -
              </Button>
              {item.quantity}
              <Button
                onClick={() => increaseQuantity(item.id, item.color, item.size)}
                style={{ marginLeft: "10px" }}
              >
                +
              </Button>
              <Button
                className="delete"
                onClick={() => removeItem(item.id, item.color, item.size)}
                style={{ marginLeft: "10px" }}
                type="danger"
              >
                Xóa
              </Button>
            </div>
          </List.Item>
        )}
      />
      <div style={{ textAlign: "right" }}>
        <Title level={4}>Tiền hàng: {formatNumber(totalPrice)} VND</Title>
        {totalDiscount > 0 && (
          <Title level={5} style={{ color: "gray" }}>
            Giảm giá: -{formatNumber(totalDiscount)} VND
          </Title>
        )}
        <Title level={4} style={{ color: "red" }}>
          Tổng đơn giá: {formatNumber(finalTotalPrice)} VND
        </Title>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={handleOrder} // Show modal when clicked
          style={{
            borderRadius: "20px",
            backgroundColor: "#322a2a",
            color: "white",
          }}
        >
          Đặt hàng
        </Button>
      </div>

      {/* Use the OrderModal component */}
      <OrderModal
        isVisible={isModalVisible}
        handleClose={handleCancel}
        cartItems={cartItems}
        setCartItems={setCartItems}
        totalPrice={totalPrice}
        totalDiscount={totalDiscount}
        finalTotalPrice={finalTotalPrice}
        user={user}
        onOrderSuccess={clearCart}
      />
    </Card>
  );
};

export default CartItem;
