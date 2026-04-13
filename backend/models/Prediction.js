const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
  tumor_detected: {
    type: Boolean,
    required: true
  },
  tumor_type: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", predictionSchema);