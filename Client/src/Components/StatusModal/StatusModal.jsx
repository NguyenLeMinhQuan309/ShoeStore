import React, { useEffect, useState } from "react";
import { Modal, Typography, Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const statusMessages = {
  1: {
    title: "Giao dịch thành công",
    description: "Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đang được xử lý.",
    icon: <CheckCircleOutlined style={{ color: "green", fontSize: "36px" }} />,
  },
  2: {
    title: "Giao dịch thất bại",
    description:
      "Giao dịch không thành công. Vui lòng thử lại hoặc chọn phương thức khác.",
    icon: <CloseCircleOutlined style={{ color: "red", fontSize: "36px" }} />,
  },
  pending: {
    title: "Đơn hàng chưa thanh toán",
    description:
      "Đơn hàng của bạn chưa được thanh toán. Vui lòng hoàn tất thanh toán.",
    icon: (
      <ExclamationCircleOutlined
        style={{ color: "orange", fontSize: "36px" }}
      />
    ),
  },
  3: {
    title: "Giao dịch đang xử lý",
    description:
      "Giao dịch của bạn đang được xử lý. Vui lòng chờ trong giây lát.",
    icon: <ClockCircleOutlined style={{ color: "blue", fontSize: "36px" }} />,
  },
};

const TransactionStatusModal = ({
  isVisible,
  transid,
  handleClose,
  setPaid,
}) => {
  const [status, setStatus] = useState(3);

  useEffect(() => {
    let pollingTimer;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/payment/orderStatus/${transid}`,
          { method: "POST" }
        );
        if (response.ok) {
          const data = await response.json();
          setStatus(data.return_code);

          // Stop polling if transaction is either successful or failed
          if (data.return_code === 1 || data.return_code === 2) {
            clearInterval(pollingTimer);

            // Update the paid state in the parent component if the transaction is successful
            if (data.return_code === 1) {
              setPaid(true);
            }
          }
        } else {
          console.error("Error fetching payment status:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    if (isVisible && transid) {
      fetchStatus(); // Initial fetch
      pollingTimer = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    }

    // Cleanup timer on component unmount or modal close
    return () => clearInterval(pollingTimer);
  }, [isVisible, transid, setPaid]);

  const message = statusMessages[status] || statusMessages[3];

  return (
    <Modal visible={isVisible} onCancel={handleClose} footer={null} centered>
      <div style={{ textAlign: "center" }}>
        {message.icon}
        <Title level={3}>{message.title}</Title>
        <Text>{message.description}</Text>
        <div style={{ marginTop: "20px" }}>
          {/* Show the "Close" button only if the transaction is complete */}
          {(status === 1 || status === 2) && (
            <Button type="primary" onClick={handleClose}>
              Đóng
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TransactionStatusModal;
