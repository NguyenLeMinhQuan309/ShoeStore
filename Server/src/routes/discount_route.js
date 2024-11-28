const express = require("express");
const router = express.Router();
const DiscountController = require("../app/controllers/discount_controller");

router.get("/getAll", DiscountController.getAll);
router.post("/addDiscount", DiscountController.createDiscount);
router.delete("/deleteDiscount", DiscountController.deleteDiscount);
router.delete("/deleteDiscount/:id", DiscountController.deleteDiscountById);

module.exports = router;
