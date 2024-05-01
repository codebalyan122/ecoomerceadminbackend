// index.js
const express = require("express");
const app = express();
const connectToMongoDB = require("./database");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

// Middleware
app.use(express.json()); // Use built-in JSON parsing middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
connectToMongoDB();

// Use the router
app.use("/api", router);

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
