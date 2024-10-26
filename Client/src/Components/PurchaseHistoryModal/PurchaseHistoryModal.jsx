import React, { useState, useEffect } from "react";
import { Modal, Table, Button, notification } from "antd";
import "./PurchaseHistoryModal.css"; // Create a CSS file for custom styles

const PurchaseHistoryModal = ({ isVisible, handleClose, user }) => {
  const [orders, setOrders] = useState([]);

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

  // Cấu hình cột cho bảng đơn hàng
  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ngày Giao",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Tổng Giá Trị",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total.toLocaleString()} VND`,
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
              {item.price.toLocaleString()} VND
            </li>
          ))}
        </ul>
      ),
    },
  ];

  return (
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
      />
    </Modal>
  );
};

export default PurchaseHistoryModal;
