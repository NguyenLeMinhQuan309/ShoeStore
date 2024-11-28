const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    active: { type: Boolean, default: true },
    color: { type: String, required: true },
    discountPercentage: { type: Number, required: true }, // % giảm giá
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value < this.endDate;
        },
        message: "Start date must be before end date.",
      },
    },

    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discount", DiscountSchema);
