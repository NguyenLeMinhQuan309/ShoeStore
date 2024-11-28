const Review = require("../../models/reviews_model");

class ReviewsController {
  // POST: Add a new review
  async addReview(req, res) {
    try {
      const { id, userId, title, rating, comment } = req.body;

      // Validate required fields
      if (!id || !userId || !title || !rating) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Check if the user has already reviewed this product
      const existingReview = await Review.findOne({ userId, id });
      if (existingReview) {
        return res
          .status(400)
          .json({ error: "You have already reviewed this product." });
      }

      // Create and save the new review
      const review = new Review({ id, userId, title, rating, comment });
      await review.save();

      // Populate user info after saving
      const populatedReview = await Review.findById(review._id).populate(
        "userId",
        "name image"
      );

      res.status(201).json({
        message: "Review added successfully!",
        review: populatedReview,
      });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Failed to add review." });
    }
  }

  // POST: Get all reviews for a specific product by ID
  async getbyId(req, res) {
    try {
      const { id } = req.body;

      // Validate input
      if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
      }

      const reviews = await Review.find({ id }).populate(
        "userId",
        "name image"
      );
      if (!reviews.length) {
        return res
          .status(404)
          .json({ message: "No reviews found for this product." });
      }
      console.log(reviews);

      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews by ID:", error);
      res.status(500).json({ error: "Failed to fetch reviews." });
    }
  }

  // GET: Get all reviews
  async getAll(req, res) {
    try {
      const reviews = await Review.find().populate("userId", "name");
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews." });
    }
  }

  // POST: Get average rating and total reviews for a product
  async getAverageRating(req, res) {
    try {
      const { id } = req.body;

      // Validate input
      if (!id) {
        return res.status(400).json({ error: "Product ID is required." });
      }

      const ratingData = await Review.aggregate([
        { $match: { id } },
        {
          $group: {
            _id: null,
            avgStars: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json({
        averageStars: ratingData[0]?.avgStars || 0,
        totalReviews: ratingData[0]?.totalReviews || 0,
      });
    } catch (error) {
      console.error("Error fetching average rating:", error);
      res.status(500).json({ error: "Failed to fetch average rating." });
    }
  }

  // DELETE: Delete a review by ID
  async deleteById(req, res) {
    try {
      const { id } = req.params;

      // Validate input
      if (!id) {
        return res.status(400).json({ error: "Review ID is required." });
      }

      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found." });
      }

      res.status(200).json({ message: "Review deleted successfully." });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review." });
    }
  }

  // GET: Get total number of reviews
  async totalReviews(req, res) {
    try {
      const total = await Review.countDocuments();
      res.status(200).json({ total });
    } catch (error) {
      console.error("Error fetching total reviews:", error);
      res.status(500).json({ error: "Failed to fetch total reviews." });
    }
  }
}

module.exports = new ReviewsController();
