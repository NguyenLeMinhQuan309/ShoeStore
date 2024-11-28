const express = require("express");
const router = express.Router();
const CartController = require("../app/controllers/carts_controller");

router.post("/add", CartController.addToCart);
router.post("/getall", CartController.getall);
router.patch("/update-quantity", CartController.updateQuantity);
router.delete("/delete", CartController.remove);
router.delete("/deleteItem", CartController.removeItem);
router.get("/checkout", CartController.checkout_cart);

module.exports = router;
