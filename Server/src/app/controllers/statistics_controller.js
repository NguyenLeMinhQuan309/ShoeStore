const Order = require("../../models/orders_model");

class StatisticController {
  async product(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { status: "paid" } }, // Chỉ tính các đơn hàng đã thanh toán
        {
          $group: {
            _id: "$productId",
            totalQuantity: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        {
          $lookup: {
            from: "products", // Collection tên là "products"
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            productName: "$product.name",
            totalQuantity: 1,
            totalRevenue: 1,
          },
        },
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async day(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } }, // Nhóm theo ngày
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } }, // Sắp xếp theo ngày
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async month(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } }, // Nhóm theo tháng
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } }, // Sắp xếp theo tháng
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async year(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id: { $year: "$orderDate" }, // Nhóm theo năm
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: "$quantity" },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } }, // Sắp xếp theo năm
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new StatisticController();
