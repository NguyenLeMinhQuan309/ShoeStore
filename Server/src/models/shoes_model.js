const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Shoe = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: [{ type: String, required: true }],
  brand: { type: String, required: true },
  size: [{ type: Number, required: true }], // Use Map for dynamic key-value pairs
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  images: [
    {
      color: { type: String, required: true },
      imageUrls: [{ type: String, required: true }],
    },
  ],
});

module.exports = mongoose.model("Shoes", Shoe);
