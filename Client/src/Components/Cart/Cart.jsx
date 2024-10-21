import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Popover, List, Avatar, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const email = user ? user.email : null;

        if (!email) {
          console.error("User not logged in");
          return;
        }

        const response = await fetch("http://localhost:3000/cart/getall", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setCartItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleCartClick = () => {
    window.location.href = "/cart"; // Redirect user to cart page
  };

  const popoverContent = (
    <div style={{ width: "300px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length > 0 ? (
        <List
          itemLayout="vertical" // Change layout to vertical for better styling
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={item.image}
                  style={{ width: 50, height: 50, marginRight: 10 }} // Add margin for spacing
                />
                <div>
                  <Text style={{ fontSize: "14px" }}>{item.name}</Text>
                  <div>
                    <Text type="secondary">{`${item.color} | Size: ${item.size} | Quantity: ${item.quantity} | Price: ${item.price} VND`}</Text>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <p>Your cart is empty!</p>
      )}
    </div>
  );

  return (
    <Popover content={popoverContent} title="Shopping Cart" trigger="hover">
      <ShoppingCartOutlined
        className="carticon"
        onClick={handleCartClick}
        style={{ fontSize: "24px", cursor: "pointer" }} // Adjust icon size
      />
    </Popover>
  );
};

export default Cart;
