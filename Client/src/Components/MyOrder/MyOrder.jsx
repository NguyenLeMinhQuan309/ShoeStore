import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Typography,
  notification,
  Empty,
  Popover,
  Button,
  Select,
} from "antd";
import OrderSummary from "../OrderSummary/OrderSummary";
import "./MyOrder.css";

const { Title } = Typography;
const { Option } = Select;

const MyOrder = ({ isVisible, handleClose, user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isOrderSummaryVisible, setIsOrderSummaryVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Tất cả"); // Trạng thái lọc ban đầu

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/order/getEmail/${user?.email}`
        );
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
          setFilteredOrders(data.filter((dat) => dat.status !== "Đã giao")); // Hiển thị tất cả đơn hàng ban đầu
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
      fetchOrders();
    }
  }, [isVisible, user]);

  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderSummaryVisible(true);
  };

  const handleOrderSummaryClose = () => {
    setIsOrderSummaryVisible(false);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status); // Cập nhật trạng thái lọc
    if (status === "Tất cả") {
      setFilteredOrders(orders.filter((order) => order.status !== "Đã giao")); // Hiển thị tất cả trừ đơn hàng "Đã giao"
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

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
                key={`${product.id}-${product.size}-${product.color}`}
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
                  }}
                >
                  {product.id}-{product.name}
                </span>
              </Popover>
            ))
            .reduce((prev, curr) => [prev, ", ", curr])}
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
      title: "Trị giá",
      dataIndex: "total",
      key: "total",
      render: (total) => {
        return formatNumber(total) + ` VND`;
      },
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
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <>
      <Modal
        width={800}
        visible={isVisible}
        onCancel={handleClose}
        footer={null}
      >
        <Title level={4}>Danh sách đơn hàng</Title>

        {/* ComboBox để lọc trạng thái */}
        <Select
          style={{ width: 200, marginBottom: "1rem" }}
          value={filterStatus}
          onChange={handleFilterChange}
          placeholder="Chọn trạng thái đơn hàng"
        >
          <Option value="Tất cả">Tất cả</Option>
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>

        {filteredOrders.length > 0 ? (
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="id"
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            onRow={(record) => ({
              onClick: () => handleOrderClick(record.id),
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
