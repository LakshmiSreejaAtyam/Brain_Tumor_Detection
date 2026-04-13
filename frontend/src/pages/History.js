import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles.css";

function History() {

  const [records, setRecords] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:4000/analytics/history")
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));

  }, []);

  return (
    <div className="history-container">

      <h2>Prediction History</h2>

      <table className="history-table">

        <thead>
          <tr>
            <th>Date</th>
            <th>Tumor Detected</th>
            <th>Tumor Type</th>
            <th>Stage</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>

          {records.map((item, index) => (

            <tr key={index}>
              <td>{new Date(item.uploaded_at).toLocaleString()}</td>

              <td>
                {item.tumor_detected ? "Yes" : "No"}
              </td>

              <td>{item.tumor_type}</td>

              <td>{item.stage}</td>

              <td>
                {(item.confidence * 100).toFixed(2)}%
              </td>
            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default History;