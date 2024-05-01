const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  price: { type: Number, required: true },
  color: { type: String, required: true },
  categories: [
    {
      topCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TopCategory" },
      midCategory: [
        { type: mongoose.Schema.Types.ObjectId, ref: "MidCategory" },
      ],
    },
  ],
  isNewArrival: { type: String },
  isBestSelling: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
