// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const OrderController = require("../app/controllers/orders_controller");

// Get all orders
router.get("/", OrderController.getOrders);

// Get a specific order by ID
router.get("/getEmail/:email", OrderController.getOrderByEmail);
router.get("/getId/:id", OrderController.getOrderById);
// Create a new order
router.post("/", OrderController.createOrder);

router.post("/cancel-request/:id", OrderController.cancelRequest);
// Update order status by ID
router.put("/:id/status", OrderController.updateOrderStatus);
router.put("/:id/paid", OrderController.updateOrderPaid);
// Delete an order by ID
router.delete("/:id", OrderController.deleteOrder);

module.exports = router;
