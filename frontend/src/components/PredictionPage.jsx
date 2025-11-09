// src/components/PredictionPage.jsx
import React, { useState, useEffect } from "react";

/**
 * PredictionPage
 * - Left: Patient Data Input (bigger)
 * - Middle: large visualizations (LOS bar + mortality gauge)
 * - Bottom: Quick Notes only
 * - No right "Quick Summary" box
 *
 * Saves downloaded reports metadata to localStorage under key "userReports".
 */

export default function PredictionPage({ backToDashboard }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "Male",
    bloodPressure: "",
    heartRate: "",
    oxygenLevel: "",
    temperature: "",
    diagnosis: "Pneumonia",
    medications: "Lisinopril",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storedPatientId, setStoredPatientId] = useState(null);

  useEffect(() => {
    // Try several localStorage keys to get registration ID (not username)
    const pid =
      localStorage.getItem("patientId") ||
      localStorage.getItem("registeredId") ||
      localStorage.getItem("id") ||
      localStorage.getItem("userId");
    if (pid) setStoredPatientId(pid);
  }, []);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const runPrediction = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const predictedLos = (parseInt(formData.age || 0, 10) % 7) + 2;
      const mortality = Math.min(
        95,
        ((parseInt(formData.age || 0, 10) % 10) * 4) + 2
      );
      const pid = storedPatientId || `P${Date.now().toString().slice(-5)}`;
      setResult({
        patientId: pid,
        predictedLos,
        mortality,
      });
      setLoading(false);
    }, 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runPrediction();
  };

  const downloadReport = () => {
    if (!result) return alert("No report available to download.");

    const text = [
      "Patient Outcome Report",
      "======================",
      `Patient ID: ${result.patientId}`,
      `Age: ${formData.age}`,
      `Gender: ${formData.gender}`,
      `Diagnosis: ${formData.diagnosis}`,
      `Medications: ${formData.medications}`,
      "",
      "Predictions",
      `Predicted LOS (days): ${result.predictedLos}`,
      `In-Hospital Mortality: ${result.mortality}%`,
      "",
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");

    // trigger file download
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patient_report_${result.patientId}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    // Save metadata + contents in localStorage for Reports page
    try {
      const reportData = {
        patientId: result.patientId,
        diagnosis: formData.diagnosis,
        los: result.predictedLos,
        mortality: result.mortality,
        generatedAt: new Date().toLocaleString(),
        fileName: `patient_report_${result.patientId}.txt`,
        text,
      };
      const existing = JSON.parse(localStorage.getItem("userReports") || "[]");
      existing.unshift(reportData); // newest first
      localStorage.setItem("userReports", JSON.stringify(existing));
    } catch (err) {
      console.error("Failed to save report to localStorage:", err);
    }
  };

  /* ---------- Small UI components ---------- */
  const BackBtn = () =>
    backToDashboard ? (
      <button
        onClick={backToDashboard}
        style={{
          background: "transparent",
          border: "none",
          color: "#0d6efd",
          cursor: "pointer",
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        ← Back to Dashboard
      </button>
    ) : null;

  const LOSBar = ({ value }) => {
    const max = 14;
    const heightPx = Math.round(Math.min(1, (value || 0) / max) * 260);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 80,
            height: 260,
            borderRadius: 10,
            background: "#f1f5f9",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 8,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${heightPx}px`,
              background: "linear-gradient(180deg,#2563eb,#60a5fa)",
              borderRadius: 8,
            }}
          />
        </div>
        <div style={{ marginTop: 14, fontWeight: 800, fontSize: 18 }}>{value ?? "-"}</div>
        <div style={{ marginTop: 8, color: "#555" }}>LOS (days)</div>
      </div>
    );
  };

  const Gauge = ({ percent = 0, size = 180 }) => {
    const pct = Math.max(0, Math.min(100, Math.round(percent)));
    const radius = (size - 20) / 2;
    return (
      <svg width={size} height={size / 1.4}>
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        <g transform={`translate(${size / 2}, ${size / 1.4})`}>
          <path
            d={describeArc(0, 0, radius, -180, 0)}
            stroke="#eef2f7"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={describeArc(0, 0, radius, -180, -180 + (180 * pct) / 100)}
            stroke="url(#g1)"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="0"
            y="-6"
            textAnchor="middle"
            style={{ fontSize: 26, fontWeight: 800, fill: "#111" }}
          >
            {`${pct}%`}
          </text>
          <text x="0" y="28" textAnchor="middle" style={{ fontSize: 14, fill: "#666" }}>
            Mortality
          </text>
        </g>
      </svg>
    );
  };

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" ");
  }

  /* ---------- Layout ---------- */
  return (
    <div style={{ padding: 20 }}>
      <BackBtn />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "600px 1fr",
          gap: 20,
          alignItems: "start",
          maxWidth: 1300,
          margin: "8px auto",
          background: "#fff",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 8px 28px rgba(15,23,42,0.06)",
        }}
      >
        {/* LEFT: Patient Input */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 22,
            boxShadow: "inset 0 0 0 1px #f1f5f9",
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 12, fontSize: 20 }}>
            Patient Data Input
          </div>

          <div style={{ color: "#444", marginBottom: 8 }}>
            <strong>Patient ID:</strong> {storedPatientId ?? "-"}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
            {[
              ["Age", "age", "number", "e.g. 68"],
              ["Gender", "gender", "select"],
              ["Blood Pressure", "bloodPressure", "text", "120/80"],
              ["Heart Rate", "heartRate", "number", "bpm"],
              ["Oxygen (%)", "oxygenLevel", "number", "e.g. 97"],
              ["Temperature", "temperature", "number", "°C"],
              ["Diagnosis", "diagnosis", "text"],
              ["Medications", "medications", "text"],
            ].map(([label, name, type, placeholder]) => (
              <div key={name} style={{ display: "flex", gap: 12 }}>
                <label style={{ minWidth: 120, alignSelf: "center", fontWeight: 600 }}>
                  {label}
                </label>
                {type === "select" ? (
                  <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={inputStyle}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
              <button type="submit" style={predictBtn} disabled={loading}>
                {loading ? "Predicting…" : "Predict"}
              </button>

              {result && (
                <button type="button" onClick={downloadReport} style={downloadBtn}>
                  Download Report
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: Visualizations */}
        <div style={{ padding: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>
            Prediction Dashboard
          </div>

          <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
            <LOSBar value={result?.predictedLos ?? 0} />
            <Gauge percent={result?.mortality ?? 0} size={220} />
          </div>

          {/* History & Reports */}
          <div style={{ marginTop: 30 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>History & Reports</div>
            <div style={{ background: "#fafbfd", padding: 14, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ color: "#555" }}>Patient ID</div>
                <div style={{ fontWeight: 800 }}>
                  {result?.patientId ?? storedPatientId ?? "-"}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "#555" }}>Mortality</div>
                <div style={{ fontWeight: 800 }}>
                  {result?.mortality ? `${result.mortality}%` : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Prediction Result */}
      {result && (
        <div
          style={{
            maxWidth: 1300,
            margin: "22px auto",
            background: "#fff",
            borderRadius: 12,
            padding: 22,
            boxShadow: "0 8px 28px rgba(15,23,42,0.04)",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: 20 }}>Prediction Result</h3>
          <div style={{ display: "flex", gap: 40, alignItems: "center", paddingTop: 6 }}>
            <div>
              <div style={{ color: "#666", fontSize: 14 }}>Patient ID</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{result.patientId}</div>
            </div>
            <div>
              <div style={{ color: "#666", fontSize: 14 }}>Predicted LOS</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{result.predictedLos} days</div>
            </div>
            <div>
              <div style={{ color: "#666", fontSize: 14 }}>In-Hospital Mortality</div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{result.mortality}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Quick Notes */}
      <div style={{ maxWidth: 1200, margin: "16px auto", color: "#444", fontSize: 14 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Quick Notes</div>
        <div style={{ background: "#fbfdff", padding: 12, borderRadius: 8 }}>
          Patient ID is automatically loaded from your registration data (ID, not username).
          If you don’t see it, make sure the registration stored the ID in localStorage as
          <code>patientId</code> or one of: <code>registeredId</code>, <code>id</code>, <code>userId</code>.
          Click <strong>Download Report</strong> to save summary and add it to your Reports list.
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #e6eef8",
  outline: "none",
  fontSize: 15,
};

const predictBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 20px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 800,
};

const downloadBtn = {
  background: "#10b981",
  color: "#fff",
  border: "none",
  padding: "12px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};
