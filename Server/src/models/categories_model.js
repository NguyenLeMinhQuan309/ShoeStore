const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Category = new Schema({
  id: { type: String, require: true, unique: true },
  name: { type: String, require: true },
});
module.exports = mongoose.model("Categories", Category);
