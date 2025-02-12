require("dotenv").config();  

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Love = require("./model/love"); // Import the Love model
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies

app.use(express.json());
app.use(cors());

// Connect to MongoDB (Atlas or local)
const dbURI = process.env.MONGODB_URI;   // Replace with your MongoDB URI
mongoose.connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Endpoint to calculate love percentage and store names in MongoDB
app.post("/love-calculate", async (req, res) => {
  const { name1, name2 } = req.body;

  if (!name1 || !name2) {
    return res.json({ success: false, message: "Both names are required!" });
  }

  // Calculate love percentage (for demonstration, using a random percentage)
  const lovePercentage = Math.floor(Math.random() * (100 - 50 + 1) + 50);

  try {
    // Create a new document in MongoDB with names and love percentage
    const newLove = new Love({
      name1,
      name2,
      lovePercentage,
    });

    // Save the document to the database
    await newLove.save();

    // Send response with the love percentage
    res.json({ success: true, percentage: lovePercentage });
  } catch (error) {
    console.error("Error saving to MongoDB:", error);
    res.json({ success: false, message: "Error saving data to MongoDB." });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
