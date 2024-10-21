const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
  id: { type: String, require: true },
  url: [{ type: String }],
  color: { type: Number },
});

module.exports = mongoose.model("Images", Image);
