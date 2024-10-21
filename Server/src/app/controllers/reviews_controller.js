const Review = require("../../models/reviews_model");

class ReviewsController {
  async addReview(req, res) {
    const { id, name, email, title, rating, comment } = req.body;
    const reviews = new Review({ email, name, id, title, rating, comment });
    try {
      await reviews.save();
      res.status(201).send({ message: "Reviews added successfully!" });
    } catch (error) {
      res.status(500).send({ error: "Failed to add Reviews" });
    }
  }

  // GET: Get all reviews for a product
  async getAll(req, res) {
    try {
      const reviews = await Review.find({ id: req.body.id });
      res.status(200).send(reviews);
      console.log(reviews);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch reviews" });
    }
  }
}

module.exports = new ReviewsController();
