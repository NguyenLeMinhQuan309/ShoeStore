import { Table, Button, Modal, Select, message, Spin } from "antd";
import { useState } from "react";
import axios from "axios"; // Don't forget to import axios

const { Option } = Select;

const OrderTable = ({ orders, setOrders, onEdit, onDelete }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPaid, setSelectedPaid] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState(null);
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
  const handlePaymentStatusChange = (value) => {
    setSelectedPaid(value);
  };
  const handleOrderStatusChange = (value) => {
    setSelectedStatus(value);
  };
  const handlePaymentTypeChange = (value) => {
    setSelectedPaymentType(value);
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
  const filteredOrders = orders
    .filter((order) => selectedPaid == null || order.paid === selectedPaid)
    .filter((order) => !selectedStatus || order.status === selectedStatus)
    .filter(
      (order) =>
        !selectedPaymentType || order.paymenttype === selectedPaymentType
    )
    // .filter((product) => product.name.toLowerCase().includes(searchKeyword))
    .sort((a, b) => {
      // Replace "orderDate" with the field you want to sort by
      const dateA = new Date(a.orderDate);
      const dateB = new Date(b.orderDate);

      // For ascending order (oldest first)
      return dateA - dateB;

      // For descending order (newest first)
      // return dateB - dateA;
    });

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
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
      title: (
        <div>
          Payment Type
          <Select
            placeholder="Select Payment Type"
            style={{ width: 160, marginLeft: 8 }}
            onChange={handlePaymentTypeChange}
            allowClear
          >
            <Select.Option value={"Zalo Pay"}>Zalo Pay</Select.Option>
            <Select.Option value={"Tiền mặt"}>Tiền mặt</Select.Option>
          </Select>
        </div>
      ),
      dataIndex: "paymenttype",
    },
    {
      title: "Total Amount",
      dataIndex: "total",
      render: (total) => `${formatNumber(total)} VND`,
    },
    {
      title: "Order Date",
      dataIndex: "date",
      render: (date) => `${formatDate(date)} VND`,
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // Sorting from lowest to highest (ascending)
      sortDirections: ["ascend", "descend"], // Allow sorting in both directions
    },

    {
      title: (
        <div>
          Payment Status
          <Select
            placeholder="Select Payment Status"
            style={{ width: 160, marginLeft: 8 }}
            onChange={handlePaymentStatusChange}
            allowClear
          >
            <Select.Option value={true}>Đã thanh toán</Select.Option>
            <Select.Option value={false}>Chưa thanh toán</Select.Option>
          </Select>
        </div>
      ),
      dataIndex: "paid",
      render: (paid) => (paid ? "Đã thanh toán" : "Chưa thanh toán"),
    },

    {
      title: (
        <div>
          Order Status
          <Select
            placeholder="Select Order Status"
            style={{ width: 160, marginLeft: 8 }}
            onChange={handleOrderStatusChange}
            allowClear
          >
            <Select.Option value={"Chờ duyệt"}>Chờ duyệt</Select.Option>
            <Select.Option value={"Đã duyệt"}>Đã duyệt</Select.Option>
            <Select.Option value="Đang chuẩn bị hàng">
              Đang chuẩn bị hàng
            </Select.Option>
            <Select.Option value="Đang giao">Đang giao</Select.Option>
            <Select.Option value="Đã giao">Đã giao</Select.Option>
            <Select.Option value="Đã hủy">Đã Hủy</Select.Option>
          </Select>
        </div>
      ),
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
  return (
    <>
      <Table
        dataSource={filteredOrders}
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
          width={800}
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
            <strong>Customer Name:</strong> {selectedOrder.name}
          </p>
          <p>
            <strong>Customer Phone:</strong> {selectedOrder.phone}
          </p>
          <p>
            <strong>Address:</strong> {selectedOrder.address}
          </p>
          <p>
            <strong>Total Amount:</strong> {formatNumber(selectedOrder.total)}{" "}
            vnd
          </p>
          <p>
            <strong>Order Date:</strong> {formatDate(selectedOrder.date)}
          </p>
          {selectedOrder.shipdate && (
            <p>
              <strong>Ship Date:</strong> {formatDate(selectedOrder.shipdate)}
            </p>
          )}
          <p>
            <strong>Order Status:</strong>
            <Select
              defaultValue={selectedOrder.status}
              onChange={handleStatusChange}
              style={{ width: 200, marginLeft: 8 }}
              disabled={selectedOrder.status === "Đã hủy"} // Disable when status is "Đã hủy"
              loading={loading} // Disable selection while loading
            >
              <Option value="Chờ duyệt">Chờ duyệt</Option>
              <Option value="Đã duyệt">Đã duyệt</Option>
              <Option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Đã giao">Đã giao</Option>
              {!selectedOrder.paid ? <Option value="Đã hủy">Hủy</Option> : ""}
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
                render: (_, record) => {
                  const { price, finalPrice } = record;
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                      }}
                    >
                      {finalPrice !== price && (
                        <span
                          style={{
                            textDecoration: "line-through",
                            color: "gray",
                          }}
                        >
                          {formatNumber(price)} VND
                        </span>
                      )}
                      <span>{formatNumber(finalPrice)} VND</span>
                    </div>
                  );
                },
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
