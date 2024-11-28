const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Function to generate a slug from the name
const generateSlug = (name) => {
  return name
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove special characters
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .trim(); // Remove leading/trailing hyphens
};

const ShoeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, unique: true }, // Ensure slug is unique
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
ShoeSchema.pre("save", function (next) {
  this.slug = generateSlug(this.name); // Generate slug from the name
  next();
});

module.exports = mongoose.model("Shoes", ShoeSchema);
