import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Typography,
  notification,
  Empty,
  Popover,
  Button,
} from "antd";
import OrderSummary from "../OrderSummary/OrderSummary"; // Import OrderSummary
import "./MyOrder.css";
const { Title } = Typography;

const MyOrder = ({ isVisible, handleClose, user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Để lưu ID đơn hàng đã chọn
  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(false); // Để hiển thị OrderSummary

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/order/getEmail/${user?.email}` // Kiểm tra user trước khi lấy email
        );
        if (response.ok) {
          const data = await response.json();
          // Lọc bỏ đơn hàng có trạng thái "Đã giao"
          const filteredOrders = data.filter(
            (order) => order.status !== "Đã giao"
          );
          setOrders(filteredOrders); // Lưu danh sách đơn hàng đã lọc
        } else {
          notification.error({
            message: "Lỗi",
            description: "Không thể tải danh sách đơn hàng.",
          });
        }
      } catch (error) {
        notification.error({
          message: "Lỗi kết nối",
          description: "Không thể kết nối đến máy chủ.",
        });
      }
    };

    if (isVisible && user?.email) {
      fetchOrders(); // Gọi API khi modal hiển thị và có email người dùng
    }
  }, [isVisible, user]);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId); // Lưu ID đơn hàng đã chọn
    setIsOrderSummaryVisible(true); // Hiển thị OrderSummary
  };

  const handleOrderSummaryClose = () => {
    setIsOrderSummaryVisible(false); // Đóng OrderSummary
  };

  // Cấu trúc của bảng
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (products) => (
        <span>
          {products
            .map((product) => (
              <Popover
                key={product.id}
                content={product.name}
                title="Tên sản phẩm"
              >
                <span
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "inline-block",
                    maxWidth: "300px",
                  }} // Giới hạn chiều dài
                >
                  {product.id}-{product.name}
                </span>
              </Popover>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}{" "}
          {/* Thêm dấu phẩy giữa các sản phẩm */}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => status || "Chờ duyệt",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const formatDate = (isoDate) => {
          const dateObj = new Date(isoDate);
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          const hours = String(dateObj.getHours()).padStart(2, "0");
          const minutes = String(dateObj.getMinutes()).padStart(2, "0");

          return `${day}/${month}/${year} ${hours}:${minutes}`;
        };

        return formatDate(text);
      },
    },
  ];

  return (
    <>
      {/* Modal hiển thị danh sách đơn hàng */}
      <Modal visible={isVisible} onCancel={handleClose} footer={null}>
        <Title level={4}>Danh sách đơn hàng</Title>
        {orders.length > 0 ? (
          <Table
            dataSource={orders}
            columns={columns}
            rowKey="id"
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            } // Alternate row colors
            onRow={(record) => ({
              onClick: () => handleOrderClick(record.id), // Bấm vào hàng
            })}
          />
        ) : (
          <Empty description="Không có đơn hàng" />
        )}
        <Button
          type="primary"
          onClick={handleClose}
          style={{ marginTop: "1rem" }}
        >
          Đóng
        </Button>
      </Modal>

      {/* Modal hiển thị chi tiết đơn hàng khi bấm vào */}
      <OrderSummary
        isVisible={isOrderSummaryVisible}
        handleClose={handleOrderSummaryClose}
        orderId={selectedOrderId}
        user={user}
      />
    </>
  );
};

export default MyOrder;
