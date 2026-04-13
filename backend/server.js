const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const Prediction = require("./models/Prediction");

const app = express();

const analyticsRoutes = require("./routes/analytics");

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/analytics", analyticsRoutes);

// Multer setup (store image in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// ✅ Test Route (so browser doesn't show error)
app.get("/", (req, res) => {
  res.send("Brain Tumor Backend Running ✅");
});


// ✅ Prediction Route
app.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert image to base64
    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");

    // Send to Flask ML API (PORT 5100)
    const response = await axios.post("http://127.0.0.1:5100/predict", {
      image: base64Image
    });

    const predictionData = response.data;

    // Save to MongoDB
    const newPrediction = new Prediction({
      tumor_detected: predictionData.tumor_detected,
      tumor_type: predictionData.tumor_type,
      stage: predictionData.stage,
      confidence: predictionData.confidence
    });

    await newPrediction.save();

    console.log("Prediction saved to MongoDB ✅");

    res.json(predictionData);

  } catch (error) {
    console.error("Prediction Error:", error.message);
    res.status(500).json({ error: "Prediction failed" });
  }
});


// Start server
app.listen(4000, () => {
  console.log("Backend running on http://localhost:4000");
});