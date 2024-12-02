const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Function to generate a slug from the name

const ShoeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  // stock: { type: Number, required: true },
  description: { type: String },
  gender: { type: Number },
  images: [
    {
      color: { type: String, required: true },
      imageUrls: [{ type: String, required: true }],
      price: { type: Number, required: true },
      stock: [
        {
          size: { type: Number },
          quantity: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

// Pre-save hook to generate slug before saving the document

module.exports = mongoose.model("Shoes", ShoeSchema);
