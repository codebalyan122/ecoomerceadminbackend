// index.js
const express = require("express");
const app = express();
const connectToMongoDB = require("./database");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const MAX_REQUEST_SIZE = "50mb";
// Middleware
app.use(express.json()); // Use built-in JSON parsing middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json({ limit: MAX_REQUEST_SIZE }));
app.use(bodyParser.urlencoded({ extended: true, limit: MAX_REQUEST_SIZE }));
// Connect to MongoDB
connectToMongoDB();

// Use the router
app.use("/api", router);

// Start the server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
