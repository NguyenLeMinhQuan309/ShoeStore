const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductViewHistorySchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("ProductViewHistory", ProductViewHistorySchema);
