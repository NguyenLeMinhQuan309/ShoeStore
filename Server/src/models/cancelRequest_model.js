const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cancelRequest = new Schema({
  email: { type: String, require: true },
  id: { type: String, unique: true },
  cancelRequest: { type: Boolean },
});

module.exports = mongoose.model("cancelRequests", cancelRequest);
