import React, { useState, useEffect } from "react";
import { Modal, Table, Button, notification } from "antd";
import OrderSummary from "../OrderSummary/OrderSummary";
import "./PurchaseHistoryModal.css"; // Create a CSS file for custom styles

const PurchaseHistoryModal = ({ isVisible, handleClose, user }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(false);
  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.email) {
        // Kiểm tra user trước khi lấy email
        try {
          const response = await fetch(
            `http://localhost:3000/order/getEmail/${user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setOrders(data); // Lưu danh sách đơn hàng
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
      }
    };

    fetchOrders();
  }, [user]); // Hàm useEffect phụ thuộc vào user để gọi lại khi user thay đổi

  // Lọc các đơn hàng đã giao
  const deliveredOrders = orders.filter((order) => order.status === "Đã giao");

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderSummaryVisible(true);
  };

  const handleOrderSummaryClose = () => {
    setIsOrderSummaryVisible(false);
  };
  // Cấu hình cột cho bảng đơn hàng
  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày Giao",
      dataIndex: "shipdate",
      key: "shipdate",
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
    {
      title: "Tổng Giá Trị",
      dataIndex: "total",
      key: "total",
      render: (total) => `${formatNumber(total)} VND`,
    },
    {
      title: "Sản Phẩm",
      dataIndex: "product",
      key: "product",
      render: (items) => (
        <ul>
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "1rem" }}>
              <img
                src={item.image} // Assuming each item has an `imageUrl` field
                alt={item.name}
                style={{ width: "50px", marginRight: "10px" }}
              />
              {item.name} - Số lượng: {item.quantity} - Giá:{" "}
              {formatNumber(item.price)} VND
            </li>
          ))}
        </ul>
      ),
    },
  ];
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <>
      <Modal
        title="Lịch Sử Mua Hàng"
        visible={isVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={deliveredOrders}
          columns={columns}
          rowKey="orderId"
          pagination={false}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          } // Alternate row colors
          onRow={(record) => ({
            onClick: () => handleOrderClick(record.id),
          })}
        />
      </Modal>
      <OrderSummary
        isVisible={isOrderSummaryVisible}
        handleClose={handleOrderSummaryClose}
        orderId={selectedOrderId}
        user={user}
      />
    </>
  );
};

export default PurchaseHistoryModal;
