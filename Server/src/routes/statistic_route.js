const express = require("express");
const router = express.Router();
const StatisticController = require("../app/controllers/statistics_controller");

router.get("/product", StatisticController.product);
router.get("/day", StatisticController.day);
router.get("/month", StatisticController.month);
router.get("/year", StatisticController.year);
router.get("/topselling", StatisticController.topselling);
router.get("/revenueoverview", StatisticController.revenue);
router.get("/revenue", StatisticController.revenueAndTopSelling);

module.exports = router;
