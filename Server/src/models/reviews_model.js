const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
  userId: {
    type: Schema.Types.ObjectId, // Correct type for referencing another collection
    ref: "Users",
    required: true, // Ensure userId is always provided
    index: true, // Add index for faster queries
  },
  id: {
    type: Schema.Types.String,
    ref: "Shoes",
    required: true,
    index: true, // Add index for querying by product ID
  },
  title: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 }, // Limit rating values
  comment: { type: String }, // Optional field
  createAt: { type: Date, default: Date.now }, // Ensure default creation timestamp
});

module.exports = mongoose.model("Reviews", Review);
