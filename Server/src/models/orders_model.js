const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Order = new Schema({
  email: { type: String, required: true }, // Sửa từ require thành required
  name: { type: String, required: true },
  phone: { type: Number, require: true },
  id: { type: String, unique: true },
  address: { type: String },
  total: { type: Number },
  date: { type: Date, default: Date.now }, // Ngày tạo đơn hàng, mặc định là thời gian hiện tại
  shipdate: { type: Date },
  status: {
    type: String,
    enum: [
      "Chờ duyệt",
      "Đã duyệt",
      "Đang chuẩn bị hàng",
      "Đang giao",
      "Đã giao",
      "Đã hủy",
    ], // Trạng thái cho phép
    default: "Chờ duyệt", // Trạng thái mặc định
  },
  paid: { type: Boolean, default: false },
  paymenttype: { type: String },
  product: [
    {
      id: { type: String },
      image: [{ type: String }],
      name: { type: String },
      color: { type: String },
      size: { type: String },
      price: { type: Number },
      finalPrice: { type: Number },
      quantity: { type: Number },
    },
  ],
});

// Xuất model
module.exports = mongoose.model("Orders", Order);
