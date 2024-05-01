// database.js
const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://balyancode122:balyancode122@cluster0.xp7enxg.mongodb.net/";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process with a non-zero exit code
  }
};

module.exports = connectToMongoDB;
