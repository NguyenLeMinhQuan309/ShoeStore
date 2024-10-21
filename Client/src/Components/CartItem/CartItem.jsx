import React, { useState, useEffect } from "react";
import { Card, Button, List, Typography } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import OrderModal from "../OrderModal/OrderModal"; // Import the OrderModal component
import "./CartItem.css";

const { Title } = Typography;

const CartItem = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
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

  const increaseQuantity = async (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    // Update quantity in the database
    await updateCartQuantity(
      id,
      updatedCart.find((item) => item.id === id).quantity
    );
  };

  const decreaseQuantity = async (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    // Update quantity in the database
    await updateCartQuantity(
      id,
      updatedCart.find((item) => item.id === id).quantity
    );
  };

  const removeItem = async (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    // Remove item from the database
    await fetch(`http://localhost:3000/cart/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  };

  const updateCartQuantity = async (id, quantity) => {
    try {
      await fetch(`http://localhost:3000/cart/update-quantity`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, quantity }),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Function to handle showing the modal
  const handleOrder = () => {
    setIsModalVisible(true);
  };

  // Function to handle modal close
  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
            <span>{item.price} VND</span>
            <div className="quantity">
              <Button
                onClick={() => decreaseQuantity(item.id)}
                style={{ marginLeft: "10px", marginRight: "10px" }}
              >
                -
              </Button>
              {item.quantity}
              <Button
                onClick={() => increaseQuantity(item.id)}
                style={{ marginLeft: "10px" }}
              >
                +
              </Button>
              <Button
                className="delete"
                onClick={() => removeItem(item.id)}
                style={{ marginLeft: "10px" }}
                type="danger"
              >
                Xóa
              </Button>
            </div>
          </List.Item>
        )}
      />
      <Title level={4} style={{ textAlign: "right" }}>
        Tổng tiền: {totalPrice} VND
      </Title>
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
        totalPrice={totalPrice}
        user={user}
      />
    </Card>
  );
};

export default CartItem;
