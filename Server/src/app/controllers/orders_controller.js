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
      "Đang chuẩn bị hàng",
      "Đang giao",
      "Đã giao",
      "Đã hủy",
    ];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          paid: req.body.status == "Đã giao" ? true : false,
        },
        { new: true }
      );
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
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Đơn hàng không tồn tại." });
      }

      // Kiểm tra trạng thái đơn hàng trước khi gửi yêu cầu hủy
      if (order.status === "Đã giao" || order.status === "Đã hủy") {
        return res.status(400).json({ message: "Không thể hủy đơn hàng này." });
      }

      // Gửi yêu cầu hủy (thay đổi trạng thái hoặc lưu vào một bảng yêu cầu hủy nếu cần)
      // Ví dụ, ta có thể thêm một thuộc tính mới vào đơn hàng để theo dõi yêu cầu hủy
      const newCancelRequest = (order.cancelRequest = true); // hoặc tạo một bảng riêng cho yêu cầu hủy
      await order.save();

      // Gửi thông báo tới admin (bạn có thể sử dụng email hoặc hệ thống thông báo)
      // Ví dụ: Gửi thông báo qua email tới admin
      // await sendEmailToAdmin(order); // Hàm gửi email tới admin

      res.status(200).json({ message: "Yêu cầu hủy đơn hàng đã được gửi." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại." });
    }
  }
}

module.exports = new OrderController();
