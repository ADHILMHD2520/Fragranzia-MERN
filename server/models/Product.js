const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String], required: true },
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
