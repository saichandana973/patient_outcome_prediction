// src/components/DoctorChat.jsx
import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

export default function DoctorChat({ backToDashboard }) {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hey there! I’m your AI health assistant. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [patientData, setPatientData] = useState({
    patientId: "",
    name: "",
    hospital: "",
    diagnosis: "",
  });
  const [stage, setStage] = useState("intro"); // intro → form → waiting → chat
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setMessages((m) => [...m, { sender: "user", text: userInput }]);

    if (stage === "intro") {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            sender: "bot",
            text: "Please provide your details: Patient ID, Name, Hospital, and Diagnosis.",
          },
        ]);
        setStage("form");
      }, 500);
    } else if (stage === "waiting") {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            sender: "bot",
            text:
              "👩‍⚕️ Our admin will assign a doctor soon. Please wait patiently.",
          },
        ]);
      }, 600);
    } else {
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { sender: "bot", text: "💬 Got it! I’ll pass this to your doctor soon." },
        ]);
      }, 600);
    }
    setUserInput("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      !patientData.patientId ||
      !patientData.name ||
      !patientData.hospital ||
      !patientData.diagnosis
    ) {
      alert("Please fill all fields before proceeding.");
      return;
    }

    setMessages((m) => [
      ...m,
      {
        sender: "user",
        text: `🧾 Patient Info:\nID: ${patientData.patientId}\nName: ${patientData.name}\nHospital: ${patientData.hospital}\nDiagnosis: ${patientData.diagnosis}`,
      },
      {
        sender: "bot",
        text: `✅ Thanks ${patientData.name}! Please wait while our admin assigns a doctor to you.`,
      },
    ]);

    // store locally (will link to backend later)
    localStorage.setItem(
      "consult_request",
      JSON.stringify({ ...patientData, status: "pending" })
    );

    setStage("waiting");
  };

  return (
    <div
      style={{
        maxWidth: 850,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 8px 28px rgba(0,0,0,0.06)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      {/* Back Button */}
      {backToDashboard && (
        <button
          onClick={backToDashboard}
          style={{
            alignSelf: "flex-start",
            background: "#e9ecef",
            color: "#333",
            border: "none",
            borderRadius: "8px",
            padding: "6px 14px",
            fontSize: "14px",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          ← Back to Dashboard
        </button>
      )}

      {/* Chat Box */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 16px",
          background: "#f8f9fa",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "#0d6efd" : "#e9ecef",
                color: msg.sender === "user" ? "#fff" : "#222",
                padding: "10px 14px",
                borderRadius:
                  msg.sender === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                maxWidth: "75%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Form or Input */}
      {stage === "form" ? (
        <form
          onSubmit={handleFormSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <input
            placeholder="Patient ID"
            value={patientData.patientId}
            onChange={(e) =>
              setPatientData({ ...patientData, patientId: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="Name"
            value={patientData.name}
            onChange={(e) =>
              setPatientData({ ...patientData, name: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="Hospital"
            value={patientData.hospital}
            onChange={(e) =>
              setPatientData({ ...patientData, hospital: e.target.value })
            }
            style={inputStyle}
          />
          <input
            placeholder="Diagnosis"
            value={patientData.diagnosis}
            onChange={(e) =>
              setPatientData({ ...patientData, diagnosis: e.target.value })
            }
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              background: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Submit Details
          </button>
        </form>
      ) : (
        <form onSubmit={handleInputSubmit} style={chatInputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            style={chatInput}
          />
          <button type="submit" style={sendBtn}>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}

/* ---------- Styles ---------- */
const inputStyle = {
  padding: "10px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 15,
};

const chatInputContainer = {
  display: "flex",
  gap: 8,
  borderTop: "1px solid #ddd",
  paddingTop: 8,
};

const chatInput = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 15,
  outline: "none",
};

const sendBtn = {
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "0 14px",
  cursor: "pointer",
};
