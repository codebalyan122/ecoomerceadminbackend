// index.js
const express = require("express");
const app = express();
const connectToMongoDB = require("./database");
const router = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/usersmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Settings = require("./models/settings");
const Slider = require("./models/slider");
const multer = require("multer");
const upload = multer();
const TopCategory = require("./models/topcategory");
const MidCategory = require("./models/midcategory");

const { default: mongoose } = require("mongoose");
const Product = require("./models/addproducts");

// Middleware
app.use(express.json()); // Use built-in JSON parsing middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Connect to MongoDB
connectToMongoDB();

// Use the router
// app.use("/api", router);
app.get("/", async (req, res) => {
  res.status(200).json({ msg: "something" });
});
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with hashed password
    const user = new User({
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      "sdjfgsdjkfgkjdshfksjhdfjkhfkjhfidh"
    );

    // Return the token and user details in the response
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log(user);
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "sjahdfgjsdgfkdhbkld", {
      expiresIn: "1h",
    });

    // Return the token and user details in the response
    res.status(200).json({ user, token, msg: "Login Successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a user
app.patch("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Settings Routes

app.post("/settings", async (req, res) => {
  try {
    const newSettings = new Settings(req.body);
    await newSettings.save();

    res.status(201).json({ message: "Settings saved successfully!" });
  } catch (err) {
    console.error("/api/settings error:", err);
    res.status(500).json({ error: "Error saving settings" });
  }
});
app.get("/settings", async (req, res) => {
  try {
    const settings = await Settings.find(); // Fetch all settings documents

    // Check if any settings are found
    if (!settings.length) {
      return res.status(404).json({ message: "No settings found" });
    }

    // Assuming you only expect one settings document (common for company settings)
    const retrievedSettings = settings[0]; // Get the first element (modify if needed)

    res.status(200).json(retrievedSettings);
  } catch (err) {
    console.error("/api/settings error:", err);
    res.status(500).json({ error: "Error retrieving settings" });
  }
});

app.patch("/settings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSettingsData = req.body;

    // Find the settings document by ID
    const settings = await Settings.findById(id);

    // Check if settings exist
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    // Update the settings document with the provided data
    Object.keys(updatedSettingsData).forEach((key) => {
      settings[key] = updatedSettingsData[key];
    });

    // Save the updated settings document
    const updatedSettingsDoc = await settings.save();

    res.status(200).json(updatedSettingsDoc);
  } catch (err) {
    console.error("/api/settings/:id error:", err);
    res.status(500).json({ error: "Error updating settings" });
  }
});

app.post("/sliders", upload.single("image"), async (req, res) => {
  try {
    const { name, content } = req.body;
    console.log(name, content);
    const image = req.file;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Create a new slider instance
    const newSlider = new Slider({
      name,
      content,
      image: {
        data: image.buffer,
        contentType: image.mimetype,
      },
    });

    // Save the new slider to the database
    const savedSlider = await newSlider.save();
    res.status(201).json(savedSlider);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/sliders", async (req, res) => {
  try {
    const sliders = await Slider.find();
    res.json(sliders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/sliders/:id", async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({ error: "Slider not found" });
    }

    res.json(slider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/sliders/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, content } = req.body;
    const image = req.file;

    const updatedData = {
      name,
      content,
      ...(image && {
        image: {
          data: image.buffer,
          contentType: image.mimetype,
        },
      }),
    };

    const updatedSlider = await Slider.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedSlider) {
      return res.status(404).json({ error: "Slider not found" });
    }

    res.json(updatedSlider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/topcategories", upload.single("image"), async (req, res) => {
  console.log(req.body);
  try {
    const { name, content } = req.body;
    const image = req.file;

    const newTopCategory = new TopCategory({
      name,
      content,
      ...(image && {
        image: { data: image.buffer, contentType: image.mimetype },
      }),
    });

    const savedTopCategory = await newTopCategory.save();
    res
      .status(201)
      .json({ savedTopCategory, msg: "Top Category Added succesfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/topcategories", async (req, res) => {
  try {
    const topCategory = await TopCategory.find();
    res.json(topCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/topcategories/:id", async (req, res) => {
  try {
    const topCategory = await TopCategory.findById(req.params.id);

    if (!topCategory) {
      return res.status(404).json({ error: "TopCategory not found" });
    }

    res.json(topCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/topcategories/:id", async (req, res) => {
  try {
    const topCategory = await TopCategory.findByIdAndDelete(req.params.id);
    if (!topCategory) {
      return res.status(404).json({ error: "TopCategory not found" });
    }
    res.json({ message: "TopCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/topcategories/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, content } = req.body;
    const image = req.file;

    const updatedData = {
      name,
      content,
      ...(image && {
        image: {
          data: image.buffer,
          contentType: image.mimetype,
        },
      }),
    };

    const updatedTopCategory = await TopCategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedTopCategory) {
      return res.status(404).json({ error: "Slider not found" });
    }

    res
      .status(200)
      .json({ updatedTopCategory, msg: "top categories updated sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/midcategories", upload.single("image"), async (req, res) => {
  try {
    const { name, content, categories } = req.body;
    let imageBuffer = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
    }

    const newMidCategory = new MidCategory({
      name,
      content,
      image: imageBuffer ? Buffer.from(imageBuffer, "base64") : null,
      categories: JSON.parse(categories),
    });

    const savedMidCategory = await newMidCategory.save();
    res
      .status(201)
      .json({ savedMidCategory, msg: "Mid Category added Sucessfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET API to fetch all mid categories
app.get("/midcategories", async (req, res) => {
  try {
    const midCategories = await MidCategory.find().populate("categories");
    res.json(midCategories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH API to update a mid category
app.patch("/midcategories/:id", upload.single("image"), async (req, res) => {
  console.log(req.body);
  try {
    const { name, content, categories } = req.body;
    const image = req.file;

    // Split the comma-separated string into an array
    const categoriesArray = categories.split(",");

    // Convert category IDs to ObjectId instances
    const categoryObjectIds = categoriesArray.map(
      (categoryId) => new mongoose.Types.ObjectId(categoryId)
    );

    const updatedData = {
      name,
      content,
      categories: categoryObjectIds,
      ...(image && {
        image: {
          data: image.buffer,
          contentType: image.mimetype,
        },
      }),
      updatedAt: Date.now(),
    };

    const updatedMidCategory = await MidCategory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedMidCategory) {
      return res.status(404).json({ error: "Mid category not found" });
    }

    res
      .status(200)
      .json({ updatedMidCategory, msg: "Mid Category Update Sucessfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/midcategories/:id", async (req, res) => {
  try {
    const midCategory = await MidCategory.findById(req.params.id).populate(
      "categories"
    );

    if (!midCategory) {
      return res.status(404).json({ error: "MidCategory not found" });
    }

    res.json(midCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.delete("/midcategories/:id", async (req, res) => {
  try {
    const midCategory = await MidCategory.findByIdAndDelete(req.params.id);
    if (!midCategory) {
      return res.status(404).json({ error: "MidCategory not found" });
    }
    res.json({ message: "MidCategory deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//Products

app.post("/products", upload.single("image"), async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      content,
      price,
      color,
      topCategory,
      midCategories,
      isNewArrival,
      isBestSelling,
    } = req.body;

    const midCategoriesIds = midCategories
      .split(",")
      .map((categoryId) => new mongoose.Types.ObjectId(categoryId));

    const categories = [
      {
        topCategory: new mongoose.Types.ObjectId(topCategory),
        midCategory: midCategoriesIds,
      },
    ];

    const product = new Product({
      name,
      content,
      image: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null,
      price,
      color,
      categories,
      isNewArrival,
      isBestSelling,
    });

    const savedProduct = await product.save();
    res.status(201).json({ savedProduct, msg: "Product added sucessfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categories.topCategory", "name")
      .populate("categories.midCategory", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categories.topCategory", "name")
      .populate("categories.midCategory", "name");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // console.log(product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.patch("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      content,
      price,
      color,
      topCategories,
      midCategories,
      isNewArrival,
      isBestSelling,
    } = req.body;

    console.log(req.body);
    const midCategoriesIds = midCategories
      ? midCategories
          .split(",")
          .map((categoryId) => new mongoose.Types.ObjectId(categoryId))
      : [];
    const categories = [
      {
        topCategory: new mongoose.Types.ObjectId(topCategories),
        midCategory: midCategoriesIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      },
    ];

    const updatedProduct = {
      name,
      content,
      ...(req.file && {
        image: { data: req.file.buffer, contentType: req.file.mimetype },
      }),
      price,
      color,
      categories,
      isNewArrival,
      isBestSelling,
    };

    const product = await Product.findByIdAndUpdate(id, updatedProduct, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ product, msg: "product Updated sucessfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
