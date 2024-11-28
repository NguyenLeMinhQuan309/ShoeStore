const express = require("express");
const router = express.Router();
const ReviewController = require("../app/controllers/reviews_controller");

router.post("/getbyId", ReviewController.getbyId);
router.get("/getAll", ReviewController.getAll);
router.post("/add", ReviewController.addReview);
router.post("/rating", ReviewController.getAverageRating);
router.delete("/delete/:id", ReviewController.deleteById);
router.get("/totalreviews", ReviewController.totalReviews);
module.exports = router;
