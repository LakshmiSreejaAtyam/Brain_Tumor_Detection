import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./styles.css";

function Predict() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }

    setResult(null);
  };

  const handleSubmit = async () => {

    if (!image) {
      alert("Please upload an MRI image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {

      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/predict",
        formData
      );

      setResult(response.data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      alert("Prediction failed");
      setLoading(false);
    }
  };

  // PDF Report Generator
  
  const downloadReport = () => {

  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 30, 120);
  doc.text("Brain Tumor Diagnostic Report", 20, 20);

  doc.setFontSize(12);
  doc.setTextColor(0,0,0);

  // Report information
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, 35);
  doc.text(`System: AI Brain Tumor Detection`, 20, 42);

  // Section line
  doc.line(20, 45, 190, 45);

  // Result section
  doc.setFontSize(14);
  doc.text("Analysis Result", 20, 60);

  doc.setFontSize(12);

  doc.text(
    `Tumor Detected: ${result.tumor_detected ? "Yes" : "No"}`,
    20,
    75
  );

  doc.text(`Tumor Type: ${result.tumor_type}`, 20, 85);

  doc.text(`Stage: ${result.stage}`, 20, 95);

  doc.text(
    `Confidence Score: ${(result.confidence * 100).toFixed(2)}%`,
    20,
    105
  );

  // Recommendation
  doc.setFontSize(14);
  doc.text("Recommendation", 20, 125);

  doc.setFontSize(11);

  doc.text(
    "This AI-generated result is intended for assistance only. "
    + "Please consult a qualified neurologist or oncologist "
    + "for professional medical evaluation.",
    20,
    135,
    { maxWidth: 170 }
  );

  // Add MRI Image
  if (preview) {

    const img = new Image();
    img.src = preview;

    doc.addImage(
      img,
      "JPEG",
      130,
      60,
      60,
      60
    );
  }

  // Footer
  doc.setFontSize(10);
  doc.text(
    "AI Brain Tumor Detection Platform",
    20,
    280
  );

  doc.text(
    "For educational and research purposes only.",
    20,
    287
  );

  doc.save("Brain_Tumor_Report.pdf");
};

  return (
    <div className="container">

      <h2 className="title">Brain Tumor Detection System</h2>

      <div className="card">

        <input
          type="file"
          onChange={handleImageChange}
        />

        {/* MRI Preview */}

        {preview && (
          <div className="preview-box">
            <h3>MRI Preview</h3>
            <img
              src={preview}
              alt="MRI Preview"
              className="preview-image"
            />
          </div>
        )}

        <br />

        <button onClick={handleSubmit}>
          Predict Tumor
        </button>

        {loading && <p>Analyzing MRI image...</p>}

        {/* Result */}

        {result && (

          <div className="result-box">

            <h3>Prediction Result</h3>

            <p>
              <b>Tumor Detected:</b>{" "}
              {result.tumor_detected ? "Yes" : "No"}
            </p>

            <p>
              <b>Tumor Type:</b> {result.tumor_type}
            </p>

            <p>
              <b>Stage:</b> {result.stage}
            </p>

            <p>
              <b>Confidence:</b>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>

            <button className="report-btn" onClick={downloadReport}>
              Download Medical Report
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default Predict;