const Order = require("../../models/orders_model");

class StatisticController {
  async product(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { paid: true } }, // Only consider paid orders
        { $unwind: "$product" }, // Flatten the product array
        {
          $group: {
            _id: "$product.id", // Group by product id
            productName: { $first: "$product.name" }, // Get product name
            totalQuantity: { $sum: "$product.quantity" }, // Sum quantities from the product array
            totalRevenue: {
              $sum: { $multiply: ["$product.price", "$product.quantity"] },
            }, // Calculate total revenue
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            productName: { $ifNull: ["$productName", "Unknown Product"] }, // Handle unknown products
            totalQuantity: 1,
            totalRevenue: 1,
          },
        },
      ]);

      // Return statistics or an empty array if none found
      res.json(statistics.length ? statistics : []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async day(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { paid: true } }, // Only consider paid orders
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, // Group by order date
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: { $sum: "$product.quantity" } }, // Total quantity from products
            totalRevenue: {
              $sum: { $multiply: ["$product.price", "$product.quantity"] },
            }, // Total revenue
          },
        },
        { $sort: { _id: 1 } }, // Sort by date
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async month(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { paid: true } }, // Only consider paid orders
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Group by month
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: { $sum: "$product.quantity" } }, // Total quantity from products
            totalRevenue: {
              $sum: { $multiply: ["$product.price", "$product.quantity"] },
            }, // Total revenue
          },
        },
        { $sort: { _id: 1 } }, // Sort by month
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async year(req, res) {
    try {
      const statistics = await Order.aggregate([
        { $match: { paid: true } }, // Only consider paid orders
        {
          $group: {
            _id: { $year: "$date" }, // Group by year
            totalOrders: { $sum: 1 },
            totalQuantity: { $sum: { $sum: "$product.quantity" } }, // Total quantity from products
            totalRevenue: {
              $sum: { $multiply: ["$product.price", "$product.quantity"] },
            }, // Total revenue
          },
        },
        { $sort: { _id: 1 } }, // Sort by year
      ]);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async topselling(req, res) {
    try {
      // Aggregate data to calculate total quantity sold and revenue for each product
      const topSellingProducts = await Order.aggregate([
        { $unwind: "$product" }, // Unwind the product array to handle each product item individually
        {
          $group: {
            _id: "$product.id",
            name: { $first: "$product.name" },
            image: { $first: "$product.image" },
            totalQuantitySold: { $sum: "$product.quantity" }, // Sum the quantity for each product ID
            totalRevenue: {
              $sum: { $multiply: ["$product.quantity", "$product.finalprice"] },
            }, // Calculate total revenue
          },
        },
        { $sort: { totalQuantitySold: -1 } }, // Sort by total quantity sold in descending order
      ]);

      res.json(topSellingProducts);
    } catch (error) {
      console.error("Error fetching top-selling products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  // routes/statistics.js

  async revenue(req, res) {
    const { timeFrame, date } = req.query; // Expect "month" or "year" as timeFrame
    console.log("timeFrame: " + timeFrame);
    console.log("date: " + date);

    try {
      let data;

      if (timeFrame === "month") {
        // Extract year and month from the date (e.g., "2023-01" -> "2023" and "01")
        const [year, month] = date.split("-");

        // Start of the month
        const startDate = new Date(`${year}-${month}-01T00:00:00Z`);

        // End of the month - last day of the month
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Go to the next month
        endDate.setDate(0); // Set to the last day of the current month

        // Query orders and group by day
        data = await Order.aggregate([
          {
            $match: {
              date: {
                $gte: startDate, // Start of the month
                $lt: new Date(
                  `${year}-${month}-${endDate.getDate()}T23:59:59Z`
                ), // End of the month
              },
            },
          },
          {
            $group: {
              _id: { $dayOfMonth: "$date" }, // Group by day of the month
              revenue: { $sum: "$total" }, // Sum the 'total' field for each day
            },
          },
          {
            $sort: { _id: 1 }, // Sort by day
          },
        ]);

        // Map the results to include day labels
        data = data.map((item) => ({
          day: item._id,
          revenue: item.revenue,
        }));
      } else if (timeFrame === "year") {
        // Start and end dates for the selected year
        const startDate = new Date(`${date}-01-01T00:00:00Z`); // Start of the year
        const endDate = new Date(`${date}-12-31T23:59:59Z`); // End of the year

        // Query orders and group by month
        data = await Order.aggregate([
          {
            $match: {
              date: {
                $gte: startDate, // Start of the year
                $lt: endDate, // End of the year
              },
            },
          },
          {
            $group: {
              _id: { $month: "$date" }, // Group by month
              revenue: { $sum: "$total" }, // Sum the 'total' field for each month
            },
          },
          {
            $sort: { _id: 1 }, // Sort by month
          },
        ]);

        // Map the results to include month labels
        data = data.map((item) => ({
          month: item._id,
          revenue: item.revenue,
        }));
      }

      console.log(data);
      res.json({ revenue: data });
    } catch (error) {
      console.error("Error fetching revenue overview:", error);
      res.status(500).send("Server Error");
    }
  }
  async revenueAndTopSelling(req, res) {
    const { timeFrame, date } = req.query; // Expect "month" or "year" as timeFrame
    console.log("timeFrame: " + timeFrame);
    console.log("date: " + date);

    try {
      let data = {};
      let topSellingProducts = [];

      // Determine date range based on time frame (month or year)
      let startDate, endDate;
      if (timeFrame === "month") {
        const [year, month] = date.split("-");

        // Start of the month
        startDate = new Date(`${year}-${month}-01T00:00:00Z`);

        // End of the month - last day of the month
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Go to the next month
        endDate.setDate(0); // Set to the last day of the current month

        // Revenue by day for the selected month
        data.revenue = await Order.aggregate([
          {
            $match: {
              date: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: { $dayOfMonth: "$date" },
              revenue: { $sum: "$total" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);
        data.revenue = data.revenue.map((item) => ({
          day: item._id,
          revenue: item.revenue,
        }));
        // Get top selling products for the selected month
        topSellingProducts = await Order.aggregate([
          { $unwind: "$product" },
          {
            $match: {
              date: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: "$product.id",
              name: { $first: "$product.name" },
              image: { $first: "$product.image" },
              totalQuantitySold: { $sum: "$product.quantity" },
              totalRevenue: {
                $sum: { $multiply: ["$product.quantity", "$product.price"] },
              },
            },
          },
          { $sort: { totalQuantitySold: -1 } },
          { $limit: 5 },
        ]);
      } else if (timeFrame === "year") {
        // Start and end dates for the selected year
        startDate = new Date(`${date}-01-01T00:00:00Z`);
        endDate = new Date(`${date}-12-31T23:59:59Z`);

        // Revenue by month for the selected year
        data.revenue = await Order.aggregate([
          {
            $match: {
              date: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: { $month: "$date" },
              revenue: { $sum: "$total" },
            },
          },
          {
            $sort: { _id: 1 },
          },
        ]);
        data.revenue = data.revenue.map((item) => ({
          month: item._id,
          revenue: item.revenue,
        }));
        // Get top selling products for the selected year
        topSellingProducts = await Order.aggregate([
          { $unwind: "$product" },
          {
            $match: {
              date: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
          {
            $group: {
              _id: "$product.id",
              name: { $first: "$product.name" },
              image: { $first: "$product.image" },
              totalQuantitySold: { $sum: "$product.quantity" },
              totalRevenue: {
                $sum: { $multiply: ["$product.quantity", "$product.price"] },
              },
            },
          },
          { $sort: { totalQuantitySold: -1 } },
        ]);
      }

      res.json({
        revenue: data.revenue,
        topSellingProducts: topSellingProducts,
      });
    } catch (error) {
      console.error("Error fetching revenue and top-selling products:", error);
      res.status(500).send("Server Error");
    }
  }
}

module.exports = new StatisticController();
