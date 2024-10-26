import { Table, Button, Modal, Select, message, Spin } from "antd";
import { useState } from "react";
import axios from "axios"; // Don't forget to import axios

const { Option } = Select;

const OrderTable = ({ orders, setOrders, onEdit, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoading(true); // Set loading to true before the API call
    try {
      const response = await axios.put(
        `http://localhost:3000/order/${orderId}/status`,
        { status: newStatus }
      );
      console.log(`Order ${orderId} updated to status: ${newStatus}`);
      return response.data; // Return the updated order
    } catch (error) {
      console.error("There was an error updating the order status!", error);
      message.error("Failed to update order status. Please try again."); // Show error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleRowClick = (record) => {
    setSelectedOrder(record);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleStatusChange = async (value) => {
    if (selectedOrder) {
      const updatedOrder = await updateOrderStatus(selectedOrder._id, value);
      console.log("Updated Order:", updatedOrder); // Log to check the structure
      if (updatedOrder) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrder._id ? updatedOrder.order : order
          )
        ); // Update orders in the state with the full updated order
        setSelectedOrder((prev) => ({ ...prev, ...updatedOrder })); // Update selected order to reflect changes
      }
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "_id",
    },
    {
      title: "Customer Email",
      dataIndex: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      render: (total) => `$${total ? total.toFixed(2) : "0.00"}`,
    },
    {
      title: "Order Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <Button onClick={() => onDelete(record.id)} danger>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="_id"
        className="order-management-table"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        tableLayout="fixed"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      {/* Modal for showing order details */}
      {selectedOrder && (
        <Modal
          title={`Order Details - ${selectedOrder.id}`}
          visible={!!selectedOrder} // Controlled visibility
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          <p>
            <strong>Customer Email:</strong> {selectedOrder.email}
          </p>
          <p>
            <strong>Address:</strong> {selectedOrder.address}
          </p>
          <p>
            <strong>Total Amount:</strong> $
            {selectedOrder.total ? selectedOrder.total.toFixed(2) : "0.00"}
          </p>
          <p>
            <strong>Order Status:</strong>
            <Select
              defaultValue={selectedOrder.status}
              onChange={handleStatusChange}
              style={{ width: 200, marginLeft: 8 }}
              loading={loading} // Disable selection while loading
            >
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Đã giao">Đã giao</Option>
            </Select>
          </p>

          {/* Product Details */}
          <h3>Product Details</h3>
          <Table
            dataSource={selectedOrder.product} // Assuming products is an array in the order object
            columns={[
              {
                title: "Image",
                dataIndex: "image",
                render: (text) => (
                  <img
                    src={text}
                    alt="Product Image"
                    style={{ width: 50, height: 50 }}
                  />
                ),
              },
              {
                title: "Name",
                dataIndex: "name",
              },
              {
                title: "Color",
                dataIndex: "color",
              },
              {
                title: "Size",
                dataIndex: "size",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
              },
              {
                title: "Price",
                dataIndex: "price",
                render: (price) => `$${price ? price.toFixed(2) : "0.00"}`,
              },
            ]}
            rowKey="_id" // Assuming each product also has a unique _id
            pagination={false} // Disable pagination for this sub-table
          />
        </Modal>
      )}
    </>
  );
};

export default OrderTable;
