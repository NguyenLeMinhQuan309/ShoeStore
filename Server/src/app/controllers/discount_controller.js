const Discount = require("../../models/discount_model");
const Shoes = require("../../models/shoes_model");
const cron = require("node-cron");
cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    const result = await Discount.updateMany(
      { endDate: { $lt: today }, active: true }, // Only target active discounts that have expired
      { $set: { active: false } }
    );
    console.log(
      `Cron Job: Đã cập nhật ${result.modifiedCount} giảm giá hết hạn.`
    );
  } catch (error) {
    console.error("Cron Job Error:", error.message);
  }
});
class DiscountController {
  // Tạo giảm giá
  async createDiscount(req, res) {
    try {
      const { productId, color, discountPercentage, startDate, endDate } =
        req.body;

      // Kiểm tra sản phẩm tồn tại
      const product = await Shoes.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      // Kiểm tra màu có trong sản phẩm
      const colorExists = product.images.some((image) => image.color === color);
      if (!colorExists) {
        return res.status(400).json({ message: "Màu sản phẩm không hợp lệ" });
      }

      // Kiểm tra sản phẩm đã có giảm giá hay chưa
      const existingDiscount = await Discount.findOne({ productId, color });
      if (existingDiscount) {
        return res.status(400).json({
          message: "Sản phẩm đã có giảm giá cho màu này!",
          error: message,
        });
      }

      // Tạo giảm giá
      const discount = new Discount({
        productId,
        color,
        discountPercentage,
        startDate,
        endDate,
      });
      await discount.save();

      res.status(201).json({ message: "Tạo giảm giá thành công", discount });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  async deleteDiscount(req, res) {
    try {
      const today = new Date();

      // Xóa tất cả giảm giá đã hết hạn
      const result = await Discount.deleteMany({ endDate: { $lt: today } });

      res.status(200).json({
        message: "Đã xóa giảm giá hết hạn",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
  async deleteDiscountById(req, res) {
    try {
      const { id } = req.params; // Get discount ID from the URL params
      const discount = await Discount.findByIdAndDelete(id); // Delete discount by ID

      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }

      res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to delete discount", error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const discounts = await Discount.find().exec(); // Execute the query
      console.log(discounts); // Log the fetched discounts for debugging
      res.status(200).json(discounts);
    } catch (error) {
      console.error("Error in getAll:", error); // Log error if query fails
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
}

module.exports = new DiscountController();
