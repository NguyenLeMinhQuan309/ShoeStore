const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  registrationDate: { type: Date, default: Date.now },
  profileImage: { type: String },
  gender: { type: Number },
});

module.exports = mongoose.model("Users", User);
