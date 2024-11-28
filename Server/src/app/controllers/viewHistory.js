const ProductViewHistory = require("../../models/ProductViewHistory");

class ViewHistoryController {
  async add(req, res) {
    const { email, id } = req.body;

    try {
      const existingHistory = await ProductViewHistory.findOne({
        email,
        id,
      });
      if (existingHistory) {
        existingHistory.viewCount += 1;
        existingHistory.timestamp = new Date();
        await existingHistory.save();
      } else {
        await ProductViewHistory.create({ email, id });
      }
      res.status(200).json({ message: "Product view tracked successfully" });
    } catch (error) {
      console.error("Failed to track product view:", error);
      res.status(500).json({ error: "Failed to track product view" });
    }
  }
}
module.exports = new ViewHistoryController();
