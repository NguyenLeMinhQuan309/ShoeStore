import { useState, useEffect } from "react";
import { Button, Card, Typography, Modal, message } from "antd";
import axios from "axios";
import OrderTable from "../components/OrderTable/OrderTable"; // Import OrderTable
import "./css/OrderManagement.css";

const { Title } = Typography;
const { confirm } = Modal;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    id: "",
    email: "",
    address: "",
    product: [],
    total: 0,
    status: "Chờ duyệt",
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/order/");
      setOrders(response.data);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
    }
  };

  const handleDelete = async (orderId) => {
    confirm({
      title: "Are you sure you want to delete this order?",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/order/${orderId}`);
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order.id !== orderId)
          );
          message.success(`Order ${orderId} deleted successfully.`);
        } catch (error) {
          console.error("There was an error deleting the order!", error);
          message.error("Failed to delete the order. Please try again.");
        }
      },
      onCancel() {
        console.log("Delete action canceled.");
      },
    });
  };

  const resetForm = () => {
    setEditingOrder(null);
    setNewOrder({
      id: "",
      email: "",
      address: "",
      product: [],
      total: 0,
      status: "Chờ duyệt",
    });
  };

  const handleCloseModal = () => {
    setShowPopup(false);
    resetForm();
  };

  return (
    <div className="order-management-container">
      <Title level={2} className="order-management-title">
        Order Management
      </Title>
      <Card>
        <OrderTable
          orders={orders}
          setOrders={setOrders}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  );
};

export default OrderManagement;
