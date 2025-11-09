import React, { useState } from "react";
import { contactUs } from "../api"; // ✅ Import backend API

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const response = await contactUs(formData); // ✅ Backend call
      console.log("Backend Contact Response:", response);
      setSubmitted(true);
      alert(response.message || "Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact Error:", err);
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, #f8f9fa, #e3f2fd)" }}>
      {/* FORM SECTION */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "50px" }}>
        <div style={{ backgroundColor: "#fff", padding: "50px", borderRadius: "16px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", width: "460px" }}>
          <h2 style={{ textAlign: "center", color: "#1b5686" }}>Contact Us</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {submitted && <p style={{ color: "green" }}>✅ Thank you! Your message has been sent.</p>}

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleChange} style={inputStyle} />
            <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} style={inputStyle} />
            <textarea name="message" placeholder="Message *" value={formData.message} onChange={handleChange} style={{ ...inputStyle, height: "120px" }} />
            <button type="submit" style={buttonStyle}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  backgroundColor: "#1b5686",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "18px",
  cursor: "pointer",
  fontWeight: "600",
};
