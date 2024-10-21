const express = require("express");
const router = express.Router();
const ReviewController = require("../app/controllers/reviews_controller");

router.post("/getAll", ReviewController.getAll);
router.post("/add", ReviewController.addReview);

module.exports = router;
