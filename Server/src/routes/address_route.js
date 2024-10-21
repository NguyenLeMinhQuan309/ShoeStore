const express = require("express");
const router = express.Router();
const addressController = require("../app/controllers/addresses_controller");

// Lấy địa chỉ theo email
router.get("/:email", addressController.getAddress);

// Thêm một địa chỉ mới
router.post("/", addressController.createAddress);

// Cập nhật địa chỉ theo email
router.put("/:email", addressController.updateAddress);

// Xóa địa chỉ theo email
router.delete("/:email", addressController.deleteAddress);

module.exports = router;
