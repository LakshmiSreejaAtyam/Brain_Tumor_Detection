import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Predict from "./Predict";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

import "./styles.css";

function App() {

  return (
    <Router>

      <div className="navbar">

        <Link to="/">Predict Tumor</Link>

        <Link to="/dashboard">Analytics</Link>

        <Link to="/history">Prediction History</Link>

      </div>

      <Routes>

        <Route path="/" element={<Predict />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/history" element={<History />} />

      </Routes>

    </Router>
  );
}

export default App;