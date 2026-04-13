import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import "../styles.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {

  const [summary, setSummary] = useState({});
  const [tumorStats, setTumorStats] = useState([]);
  const [tumorTypes, setTumorTypes] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:4000/analytics/summary")
      .then(res => setSummary(res.data));

    axios.get("http://localhost:4000/analytics/tumor-stats")
      .then(res => setTumorStats(res.data));

    axios.get("http://localhost:4000/analytics/tumor-types")
      .then(res => setTumorTypes(res.data));

  }, []);

  const pieData = {
    labels: tumorStats.map(item =>
      item._id ? "Tumor Detected" : "No Tumor"
    ),
    datasets: [{
      data: tumorStats.map(item => item.count),
      backgroundColor: ["#e53935", "#43a047"]
    }]
  };

  const barData = {
    labels: tumorTypes.map(item => item._id),
    datasets: [{
      label: "Tumor Type Frequency",
      data: tumorTypes.map(item => item.count),
      backgroundColor: "#1e88e5"
    }]
  };

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">
        Brain Tumor Analytics Dashboard
      </h2>

      {/* Summary Cards */}

      <div className="summary-grid">

        <div className="summary-card">
          <h3>Total Predictions</h3>
          <p>{summary.total}</p>
        </div>

        <div className="summary-card">
          <h3>Tumor Cases</h3>
          <p>{summary.tumorCases}</p>
        </div>

        <div className="summary-card">
          <h3>No Tumor Cases</h3>
          <p>{summary.noTumorCases}</p>
        </div>

        <div className="summary-card">
          <h3>Most Common Tumor</h3>
          <p>{summary.mostCommonTumor}</p>
        </div>

      </div>

      {/* Charts */}

      <div className="chart-grid">

        <div className="chart-card">
          <h3>Tumor vs No Tumor</h3>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h3>Tumor Type Distribution</h3>
          <Bar data={barData} />
        </div>

      </div>

    </div>
  );
}

export default Dashboard;