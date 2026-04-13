const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");


// Total predictions
router.get("/total", async (req, res) => {
  const total = await Prediction.countDocuments();
  res.json({ total });
});


// Tumor vs No Tumor
router.get("/tumor-stats", async (req, res) => {
  const stats = await Prediction.aggregate([
    {
      $group: {
        _id: "$tumor_detected",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(stats);
});


// Tumor type distribution
router.get("/tumor-types", async (req, res) => {
  const types = await Prediction.aggregate([
    {
      $group: {
        _id: "$tumor_type",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(types);
});


// Prediction history
router.get("/history", async (req, res) => {
  const history = await Prediction.find().sort({ uploaded_at: -1 });
  res.json(history);
});


module.exports = router;


// Dashboard summary
router.get("/summary", async (req, res) => {
  const total = await Prediction.countDocuments();

  const tumorCases = await Prediction.countDocuments({
    tumor_detected: true
  });

  const noTumorCases = await Prediction.countDocuments({
    tumor_detected: false
  });

  const mostCommonTumor = await Prediction.aggregate([
    {
      $match: { tumor_detected: true }
    },
    {
      $group: {
        _id: "$tumor_type",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);

  res.json({
    total,
    tumorCases,
    noTumorCases,
    mostCommonTumor:
      mostCommonTumor.length > 0
        ? mostCommonTumor[0]._id
        : "None"
  });
});