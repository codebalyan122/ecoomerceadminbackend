const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// Create a model
const User = mongoose.model("User", UserSchema);
module.exports = User;
