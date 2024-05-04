const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  content: { type: String, required: true },
  image: { data: Buffer, contentType: String },
  price: { type: Number, required: true },
  colors: [
    {
      name: { type: String },
      hexCode: { type: String },
    },
  ],
  model: { type: String },
  youtubeUrl: { type: String },
  categories: [
    {
      topCategory: { type: mongoose.Schema.Types.ObjectId, ref: "TopCategory" },
      midCategory: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MidCategory",
        },
      ],
    },
  ],
  isNewArrival: { type: String },
  isBestSelling: { type: String },
  productCondition: { type: String },
  minimumQuantity: { type: Number },
  estimatedShippingTime: { type: String },
  productSize: { type: String },
  wholesaleQuantity: { type: Number },
  wholesalePrice: { type: Number },
  productMeasurement: { type: String },
  manageStock: { type: Boolean },
  sizeNames: [{ type: String }],
  sizeQuantities: [{ type: Number }],
  sizePrices: [{ type: Number }],
  sizeColors: [{ type: String }],
  productColors: [
    {
      name: { type: String },
      hexCode: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
