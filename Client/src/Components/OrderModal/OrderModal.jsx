import React, { useState, useEffect } from "react";
import {
  Modal,
  List,
  Typography,
  Button,
  Input,
  notification,
  Table,
  Row,
  Col,
} from "antd";
import "./OrderModal.css";
import OrderSummary from "../OrderSummary/OrderSummary";
import StatusModal from "../StatusModal/StatusModal";
const { Title } = Typography;

const OrderModal = ({
  isVisible,
  handleClose,
  cartItems,
  setCartItems,
  totalPrice,
  totalDiscount,
  finalTotalPrice,
  user,
  onOrderSuccess,
}) => {
  const [totalAmount, setTotalAmount] = useState(totalPrice); // Local total state
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [orderId, setOrderId] = useState(null); // Thêm state để lưu orderId
  const [transid, setTransid] = useState("");
  const [paid, setPaid] = useState(false);
  const [address, setAddress] = useState({
    number: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });
  const [customer, setCustomer] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [isEditing, setIsEditing] = useState(false); // Add isEditing state
  useEffect(() => {
    const fetchAddress = async () => {
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:3000/address/${user.email}`
          );
          if (response.ok) {
            const data = await response.json();
            setAddress({
              number: data.number || "",
              street: data.street || "",
              ward: data.ward || "",
              district: data.district || "",
              city: data.city || "",
            });
          } else {
            console.error("Error fetching address:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    if (isVisible) {
      fetchAddress();
    }
  }, [isVisible, user]);
  const handleInputUserChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing); // Toggle edit mode
    if (isEditing && !address.number) {
      // If address is incomplete, prompt user to enter all fields
      notification.info({
        message: "Cập nhật thông tin địa chỉ",
        description: "Vui lòng nhập đầy đủ thông tin địa chỉ trước khi lưu.",
      });
    }
  };
  const updateInventory = async () => {
    try {
      const updateRequests = cartItems.map((item) =>
        fetch("http://localhost:3000/shoe/updateQuantity", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.id, // ID sản phẩm
            color: item.color, // Màu sắc
            size: item.size, // Size giày
            quantity: item.quantity, // Số lượng mua
            action: false, // Giảm số lượng tồn kho
          }),
        })
      );

      const responses = await Promise.all(updateRequests);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error updating inventory:", errorData.message);
          notification.error({
            message: "Lỗi cập nhật tồn kho",
            description: errorData.message,
          });
        }
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
    }
  };

  const handleSubmit = async (pay) => {
    if (!customer.name || !customer.phone) {
      notification.error({
        message: "Thông tin người đặt không đầy đủ",
        description: "Vui lòng nhập đầy đủ tên và số điện thoại.",
      });
      return;
    }

    if (
      !address.number ||
      !address.street ||
      !address.ward ||
      !address.district ||
      !address.city
    ) {
      notification.error({
        message: "Thông tin địa chỉ không đầy đủ",
        description: "Vui lòng nhập đầy đủ thông tin địa chỉ.",
      });
      return;
    }

    try {
      const addressString = `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`;

      const addressResponse = await fetch(
        `http://localhost:3000/address/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        }
      );

      if (!addressResponse.ok) {
        const errorData = await addressResponse.json();
        notification.error({
          message: "Lỗi lưu địa chỉ",
          description:
            errorData.message || "Không thể lưu địa chỉ, vui lòng thử lại.",
        });
        return null;
      }

      const orderResponse = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user ? user.email : "Chưa đăng nhập",
          name: customer.name,
          phone: customer.phone,
          product: cartItems,
          total: totalAmount,
          address: addressString,
          paymenttype: pay ? "Zalo Pay" : "Tiền mặt",
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setOrderId(orderData.order.id);
        setOrderDetails(orderData.order);
        setShowOrderSummary(true);
        handleClose();
        await updateInventory();

        const deleteCartResponse = await fetch(
          `http://localhost:3000/cart/delete`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user.email }),
          }
        );

        if (!deleteCartResponse.ok) {
          console.error("Error clearing cart:", deleteCartResponse.statusText);
          notification.warning({
            message: "Lỗi xóa giỏ hàng",
            description:
              "Giỏ hàng không được xóa hoàn toàn, vui lòng kiểm tra lại.",
          });
        }

        setCartItems([]);
        return orderData.order.id;
      } else {
        const errorData = await orderResponse.json();
        console.error("Error saving order:", errorData.message);
        notification.error({
          message: "Lỗi khi đặt hàng",
          description:
            errorData.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
        });
        return null;
      }
    } catch (error) {
      console.error("Error saving order:", error);
      notification.error({
        message: "Lỗi kết nối",
        description: "Không thể kết nối đến máy chủ, vui lòng kiểm tra lại.",
      });
      return null;
    }
  };

  useEffect(() => {
    const costData = [
      {
        key: "1",
        item: "Tiền hàng",
        cost: totalPrice, // Assuming totalPrice is the item cost
      },
      {
        key: "2",
        item: "Giá giảm",
        cost: -totalDiscount, // Assuming totalPrice is the item cost
      },
      {
        key: "3",
        item: "Phí vận chuyển",
        cost: 30000, // Example shipping cost
      },
      {
        key: "4",
        item: "Thuế (10%)",
        cost: 0.1 * finalTotalPrice, // Example tax
      },
    ];

    const total = costData.reduce((acc, curr) => acc + curr.cost, 0);
    setTotalAmount(total);
  }, [finalTotalPrice]);
  const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
  return (
    <div>
      <Modal
        width={800}
        visible={isVisible}
        onCancel={handleClose}
        footer={null}
      >
        {/* <Title level={4}>Tài khoản người đặt</Title>
        <p>Email: {user ? user.email : "Chưa đăng nhập"}</p>
        <p>Tên: {user ? user.name : "Chưa đăng nhập"}</p>
        <p>Số điện thoại: {user ? user.phone : "Chưa đăng nhập"}</p> */}

        <Row gutter={16}>
          {/* Cột thông tin người đặt */}
          <Col span={12}>
            <Title level={4}>Thông tin người đặt</Title>
            <Input
              placeholder="Tên người đặt"
              name="name"
              value={customer.name}
              onChange={handleInputUserChange}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Số điện thoại"
              name="phone"
              value={customer.phone}
              onChange={handleInputUserChange}
              style={{ marginBottom: "10px" }}
            />
          </Col>

          {/* Cột địa chỉ giao hàng */}
          <Col span={12}>
            <Title level={4}>
              Địa chỉ giao hàng
              <Button onClick={handleEditClick} style={{ marginLeft: "10px" }}>
                {isEditing ? "Lưu" : "Chỉnh sửa"}
              </Button>
            </Title>

            {isEditing ? (
              <>
                <Input
                  placeholder="Số nhà"
                  name="number"
                  value={address.number}
                  onChange={handleInputChange}
                  style={{ marginBottom: "10px" }}
                />
                <Input
                  placeholder="Tên đường"
                  name="street"
                  value={address.street}
                  onChange={handleInputChange}
                  style={{ marginBottom: "10px" }}
                />
                <Input
                  placeholder="Phường"
                  name="ward"
                  value={address.ward}
                  onChange={handleInputChange}
                  style={{ marginBottom: "10px" }}
                />
                <Input
                  placeholder="Quận"
                  name="district"
                  value={address.district}
                  onChange={handleInputChange}
                  style={{ marginBottom: "10px" }}
                />
                <Input
                  placeholder="Thành phố"
                  name="city"
                  value={address.city}
                  onChange={handleInputChange}
                  style={{ marginBottom: "10px" }}
                />
              </>
            ) : (
              <p>
                {address.number ||
                address.street ||
                address.ward ||
                address.district ||
                address.city
                  ? `${address.number}, ${address.street}, ${address.ward}, ${address.district}, ${address.city}`
                  : "Chưa có địa chỉ"}
              </p>
            )}
          </Col>
        </Row>

        <Title level={4}>Thông tin sản phẩm</Title>
        <List
          bordered
          dataSource={cartItems}
          renderItem={(item) => (
            <List.Item>
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />
              <span>{item.name}</span>
              <span>
                {item.color} / size: {item.size}
              </span>

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
            </List.Item>
          )}
        />
        <Title level={4}>Chi phí</Title>
        <Table
          dataSource={[
            { key: "1", item: "Tiền hàng", cost: totalPrice },
            { key: "2", item: "Giá giảm", cost: -totalDiscount },
            { key: "3", item: "Phí vận chuyển", cost: 30000 },
            { key: "4", item: "Thuế (10%)", cost: 0.1 * totalPrice },
          ]}
          pagination={false}
          columns={[
            { title: "Mặt hàng", dataIndex: "item", key: "item" },
            {
              title: "Giá (VND)",
              dataIndex: "cost",
              key: "cost",
              render: (text) => <span>{text.toLocaleString()}</span>,
            },
          ]}
        />

        <Title level={4} style={{ textAlign: "right" }}>
          Tổng tiền: {totalAmount.toLocaleString()} VND
        </Title>
        <Title level={4}>Phương thức thanh toán</Title>
        <p>Chọn phương thức thanh toán của bạn</p>
        <div className="paymentbutton">
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onClick={() => handleSubmit(true)} // Correct usage
          >
            Zalo Pay
          </Button>
          <Button
            type="primary"
            style={{ margin: "5px" }}
            onClick={() => handleSubmit(false)}
          >
            Thanh toán khi nhận hàng
          </Button>
        </div>
      </Modal>

      {/* Hiển thị modal đơn hàng */}
      <OrderSummary
        isVisible={showOrderSummary}
        handleClose={() => setShowOrderSummary(false)}
        orderId={orderId}
        address={address}
        paid={paid}
        setPaid={setPaid}
      />
      <StatusModal
        isVisible={showStatusModal}
        handleClose={() => setShowStatusModal(false)}
        transid={transid}
        setPaid={setPaid}
      />
    </div>
  );
};

export default OrderModal;
