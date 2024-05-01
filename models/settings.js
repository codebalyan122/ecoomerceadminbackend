const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  image: {
    type: String, // Store the image URL or path
  },
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
    // required: true,
  },
  footerCopyright: {
    type: String,
  },
  socialMedia: {
    type: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
      linkedin: String,
    },
  },
  // Additional notes can be added if needed
  // notes: {
  //   type: String,
  // },
});

module.exports = mongoose.model("Settings", settingsSchema);
