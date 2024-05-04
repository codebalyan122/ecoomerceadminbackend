const mongoose = require("mongoose");
const settingsSchema = new mongoose.Schema({
  imageURL: { type: String }, // Store the image path
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique email for each company
  },
  companyName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  footerCopyright: {
    type: String,
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String,
    linkedin: String,
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
