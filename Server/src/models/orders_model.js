const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  email: { type: String, require: true },
  id: { type: String, unique: true },
  username: { type: String },
  address: { type: String },
  total: { type: Number },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"], // Trạng thái cho phép
    default: "pending", // Trạng thái mặc định
  },
  product: [
    {
      id: { type: String },
      image: [{ type: String }],
      name: { type: String },
      color: { type: String },
      size: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Orders", Order);
