const express = require("express");
const router = express.Router();
const PaymentController = require("../app/controllers/payment_controller");
router.post("/", PaymentController.payment);
router.post("/callback", PaymentController.callback);
router.post("/orderStatus/:app_trans_id", PaymentController.orderStatus);
module.exports = router;
