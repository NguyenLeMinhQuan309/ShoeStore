const Cmt = require("../../models/cmt_model");
const Product = require("../../models/shoe_model");

class CommentController {
  async postCmt(req, res) {
    const { productId } = req.params;
    const email = req.user.email;

    const { tittle, content, rating } = req.body;

    try {
      const product = await Shoe.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const comment = new Cmt({
        productId,
        email,
        content,
        rating,
        tittle,
      });

      await comment.save();
      const cmt = await comment.populate("userId", "name");

      res.status(201).json({ message: "Comment added", cmt });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  async getCmt(req, res) {
    const { productId } = req.params;

    try {
      const comments = await Cmt.find({ productId }).populate("email", "name");

      if (!comments || comments.length === 0) {
        return res.status(204).json({
          message:
            "No comments found for this product. Be the first to leave a comment!",
          totalComments: 0,
          averageRating: 0,
        });
      }

      const totalComments = comments.length;
      const averageRating =
        comments.reduce((sum, comment) => sum + comment.rating, 0) /
        totalComments;

      res.status(200).json(comments, totalComments, averageRating);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
}

module.exports = new CommentController();
