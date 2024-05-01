const mongoose = require("mongoose");

const midCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: Buffer },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "TopCategory" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MidCategory = mongoose.model("MidCategory", midCategorySchema);

module.exports = MidCategory;
