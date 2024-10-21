const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Address = new Schema({
  email: { type: String, required: true },
  number: { type: String },
  street: { type: String },
  ward: { type: String },
  district: { type: String },
  city: { type: String },
});

module.exports = mongoose.model("Addresses", Address);
