// src/components/Analysis.jsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Analysis({ backToDashboard }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Dummy data (replace this with API data later)
    const sample = [
      { date: "2025-10-01", los: 4, mortality: 23 },
      { date: "2025-10-05", los: 3, mortality: 18 },
      { date: "2025-10-09", los: 5, mortality: 30 },
      { date: "2025-10-15", los: 2, mortality: 15 },
      { date: "2025-10-20", los: 4, mortality: 28 },
    ];
    setData(sample);
  }, []);

  // Compute summary stats
  const avgLOS =
    data.length > 0
      ? (data.reduce((a, b) => a + b.los, 0) / data.length).toFixed(1)
      : 0;
  const avgMortality =
    data.length > 0
      ? (data.reduce((a, b) => a + b.mortality, 0) / data.length).toFixed(1)
      : 0;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
        padding: 20,
      }}
    >
      {/* Back Button */}
      {backToDashboard && (
        <button
          onClick={backToDashboard}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#e9ecef",
            border: "none",
            borderRadius: 8,
            padding: "6px 14px",
            marginBottom: 16,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      )}

      <h2 style={{ color: "#0d6efd", fontWeight: 700 }}>
        📊 Patient Health Analysis
      </h2>
      <p style={{ color: "#555", marginBottom: 18 }}>
        A comprehensive view of your recent prediction results and health
        trends.
      </p>

      {/* Summary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 25,
        }}
      >
        <SummaryCard
          title="Average LOS"
          value={`${avgLOS} Days`}
          color="#0d6efd"
        />
        <SummaryCard
          title="Average Mortality"
          value={`${avgMortality}%`}
          color="#dc3545"
        />
        <SummaryCard
          title="Total Predictions"
          value={data.length}
          color="#198754"
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 25,
          marginBottom: 30,
        }}
      >
        {/* Mortality Line Chart */}
        <div
          style={{
            background: "#f9fafb",
            padding: 18,
            borderRadius: 12,
            boxShadow: "inset 0 0 0 1px #e9ecef",
          }}
        >
          <h3 style={{ color: "#333", fontWeight: 600 }}>
            Mortality Trend Over Time
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mortality" stroke="#dc3545" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* LOS Bar Chart */}
        <div
          style={{
            background: "#f9fafb",
            padding: 18,
            borderRadius: 12,
            boxShadow: "inset 0 0 0 1px #e9ecef",
          }}
        >
          <h3 style={{ color: "#333", fontWeight: 600 }}>
            Predicted LOS Per Visit
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="los" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div
        style={{
          background: "#f9fafb",
          padding: 18,
          borderRadius: 12,
          boxShadow: "inset 0 0 0 1px #e9ecef",
        }}
      >
        <h3 style={{ color: "#333", fontWeight: 600 }}>Recent Reports</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 10,
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ background: "#e9ecef" }}>
              <th style={th}>Date</th>
              <th style={th}>LOS (days)</th>
              <th style={th}>Mortality (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{row.date}</td>
                <td style={td}>{row.los}</td>
                <td style={td}>{row.mortality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */
const SummaryCard = ({ title, value, color }) => (
  <div
    style={{
      background: "#f8f9fa",
      borderRadius: 12,
      padding: 20,
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    }}
  >
    <Activity size={28} color={color} />
    <h4 style={{ color: "#333", marginTop: 10 }}>{title}</h4>
    <p style={{ fontSize: 20, fontWeight: 700, color }}>{value}</p>
  </div>
);

const th = {
  padding: "10px",
  fontWeight: 700,
  color: "#222",
  borderBottom: "2px solid #dee2e6",
};

const td = {
  padding: "10px",
  color: "#333",
};
