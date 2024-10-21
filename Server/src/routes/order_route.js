// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/orders_controller");

// Create a new order
router.post("/", OrderController.createOrder);

// Get all orders
router.get("/", OrderController.getOrders);

// Get a specific order by ID
router.get("/:id", OrderController.getOrderById);

// Update order status by ID
router.put("/:id/status", OrderController.updateOrderStatus);

// Delete an order by ID
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
