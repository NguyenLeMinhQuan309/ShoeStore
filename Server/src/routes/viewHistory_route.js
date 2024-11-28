// routes/viewHistory.js
const express = require("express");
const router = express.Router();
const ViewHistoryController = require("../app/controllers/viewHistory");

router.post("/add", ViewHistoryController.add);

module.exports = router;
