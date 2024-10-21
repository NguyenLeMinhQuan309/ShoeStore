const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  id: { type: String, require: true },
  title: { type: String, require: true },
  rating: { type: Number },
  comment: { type: String },
});

module.exports = mongoose.model("Reviews", Review);
