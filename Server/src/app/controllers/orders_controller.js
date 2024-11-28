// controllers/OrderController.js
const crypto = require("crypto");
const Order = require("../../models/orders_model");
const cancelRequest = require("../../models/cancelRequest_model");
class OrderController {
  // Create new order
  async createOrder(req, res) {
    try {
      // Tạo ID đơn hàng ngẫu nhiên
      const orderId = crypto.randomBytes(6).toString("hex"); // Tạo ID dài 32 ký tự

      // Thêm ID đơn hàng vào dữ liệu đơn hàng và trạng thái mặc định là 'pending'
      const newOrder = new Order({
        ...req.body,
        id: orderId,
        status: "Chờ duyệt",
      });
      console.log(newOrder);

      await newOrder.save();
      res
        .status(201)
        .json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
      res.status(500).json({ message: "Failed to create order", error });
    }
  }

  // Get all orders
  async getOrders(req, res) {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve orders", error });
    }
  }

  // Get order by Email
  async getOrderByEmail(req, res) {
    try {
      const order = await Order.find({ email: req.params.email });
      // console.log(order);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve order", error });
    }
  }
  async getOrderById(req, res) {
    try {
      const order = await Order.findOne({ id: req.params.id });
      // console.log(order);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve order", error });
    }
  }
  // Update order status
  async updateOrderStatus(req, res) {
    const allowedStatuses = [
      "Chờ duyệt",
      "Đã duyệt",
      "Đang chuẩn bị hàng",
      "Đang giao",
      "Đã giao",
      "Đã hủy",
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const updateData = {
        status: req.body.status,
        paid: req.body.status === "Đã giao" ? true : false,
      };

      // Nếu trạng thái là "Đã giao", cập nhật ngày `dateship` thành ngày hiện tại
      if (req.body.status === "Đã giao") {
        updateData.shipdate = new Date();
      }

      const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status", error });
    }
  }

  async updateOrderPaid(req, res) {
    try {
      const orderId = req.params.id;

      // Find the order by id and update the paid status to true
      const order = await Order.findOneAndUpdate(
        { id: orderId },
        { paid: true }, // Update the paid status
        { new: true } // Return the updated document
      );
      console.log(order);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order paid status updated", order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order paid", error });
    }
  }

  // Delete order
  async deleteOrder(req, res) {
    try {
      const order = await Order.findOneAndDelete({ id: req.params.id });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order", error });
    }
  }

  async cancelRequest(req, res) {
    const orderId = req.params.id;

    try {
      // Tìm đơn hàng theo ID
      const order = await Order.findOne({ id: orderId });

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại." });
      }

      // Kiểm tra trạng thái đơn hàng trước khi gửi yêu cầu hủy
      if (
        order.status === "Đã giao" ||
        order.status === "Đã hủy" ||
        order.status === "Đang giao" ||
        order.paymenttype === "Zalo Pay"
      ) {
        return res.status(400).json({ message: "Không thể hủy đơn hàng này." });
      }

      // Cập nhật trạng thái đơn hàng
      order.status = "Đã hủy";

      // Lưu lại thay đổi và đợi kết quả
      await order.save();

      // Trả về đơn hàng đã cập nhật
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
  }
}

module.exports = new OrderController();
