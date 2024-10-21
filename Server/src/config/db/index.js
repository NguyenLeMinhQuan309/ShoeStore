const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ShoesShop_dev");
    console.log("Connected!!!");
  } catch (error) {
    console.log("Connect fail!!!");
  }
}

module.exports = { connect };
