// controllers/OrderController.js
const crypto = require("crypto");
const Order = require("../../models/orders_model");
class OrderController {
  // Create new order
  async createOrder(req, res) {
    try {
      // Tạo ID đơn hàng ngẫu nhiên
      const orderId = crypto.randomBytes(16).toString("hex"); // Tạo ID dài 32 ký tự

      // Thêm ID đơn hàng vào dữ liệu đơn hàng và trạng thái mặc định là 'pending'
      const newOrder = new Order({
        ...req.body,
        id: orderId,
        status: "pending",
      });

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

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id);
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
    const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    try {
      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
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

  // Delete order
  async deleteOrder(req, res) {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete order", error });
    }
  }
}

module.exports = new OrderController();
