import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendEmailOTP, verifyEmailOTP } from "../api"; // ✅ updated imports

// images for the carousel
import reg1 from "../assets/register1.jpg";
import reg2 from "../assets/register2.jpg";
import reg3 from "../assets/register3.jpg";

export default function Register() {
  const [role, setRole] = useState("Patient");
  const [hospital, setHospital] = useState("");
  const [designation, setDesignation] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const hospitalOptions = [
    "RK Hospital",
    "MNM Hospital",
    "Sunrise Clinic",
    "Shyam Hospital",
  ];

  const doctorDesignations = [
    "Physician",
    "Neurologist",
    "Cardiologist",
    "Surgeon",
    "Pediatrician",
    "Senior Resident",
    "Intern",
    "Chief Doctor",
  ];

  const images = [reg1, reg2, reg3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // ✅ Step 1: Send OTP via backend
  const handleSendOtp = async () => {
    setError("");

    if (!role || !hospital || !username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (role === "Doctor" && !designation) {
      setError("Please choose a designation for Doctor role.");
      return;
    }

    setLoading(true);
    try {
      const response = await sendEmailOTP(email);
      alert("📩 OTP sent to your email! Please check your inbox.");
      console.log("OTP API Response:", response);
      setIsOtpSent(true);
    } catch (err) {
      console.error("Send OTP Error:", err);
      if (err.response?.data?.detail)
        setError(err.response.data.detail);
      else setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP via backend and register user
  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP you received.");
      return;
    }

    setLoading(true);
    try {
      const verifyResponse = await verifyEmailOTP(email, otp);
      alert("✅ OTP verified successfully!");

      // Now proceed with registration
      const registerResponse = await registerUser({
        username,
        email,
        password,
        role,
        hospital,
        designation,
      });

      console.log("Register Response:", registerResponse);
      alert(registerResponse.message || "🎉 Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Verification/Registration Error:", err);
      if (err.response?.data?.detail)
        setError(err.response.data.detail);
      else setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f2fd, #f8f9fa)",
        padding: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          maxWidth: "1200px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        {/* LEFT FORM */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: "50px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2 style={{ fontSize: "36px", fontWeight: "700", color: "#1b5686" }}>
            Create Your Account
          </h2>
          <p style={{ color: "#555", marginBottom: "25px", fontSize: "18px" }}>
            Join our community and manage your health with ease.
          </p>

          {error && (
            <p style={{ color: "red", marginBottom: "15px", fontWeight: "500" }}>
              {error}
            </p>
          )}

          {!isOtpSent ? (
            <>
              <div style={{ textAlign: "left", marginBottom: "15px" }}>
                <p style={{ fontWeight: "600", fontSize: "18px" }}>
                  Are you a Doctor or Patient?
                </p>
                <label style={{ marginRight: "20px" }}>
                  <input
                    type="radio"
                    name="role"
                    value="Patient"
                    checked={role === "Patient"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  Patient
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="Doctor"
                    checked={role === "Doctor"}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ marginRight: "8px" }}
                  />
                  Doctor
                </label>
              </div>

              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Hospital</option>
                {hospitalOptions.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </select>

              {role === "Doctor" && (
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select Designation</option>
                  {doctorDesignations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              )}

              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />

              <button
                onClick={handleSendOtp}
                style={buttonStyle}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={inputStyle}
              />
              <button
                onClick={handleVerifyOtp}
                style={buttonStyle}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Register"}
              </button>
            </>
          )}

          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            Already have an account?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>

        {/* RIGHT SLIDER */}
        <div style={styles.sliderContainer}>
          <div style={styles.arrowLeft} onClick={prevSlide}>
            ❮
          </div>
          <img
            src={images[currentIndex]}
            alt="slide"
            style={styles.sliderImage}
          />
          <div style={styles.arrowRight} onClick={nextSlide}>
            ❯
          </div>
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

const styles = {
  sliderContainer: {
    width: "50%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderImage: {
    width: "80%",
    height: "65%",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "60px",
  },
  arrowLeft: {
    position: "absolute",
    top: "50%",
    left: "12%",
    fontSize: "35px",
    cursor: "pointer",
  },
  arrowRight: {
    position: "absolute",
    top: "50%",
    right: "12%",
    fontSize: "35px",
    cursor: "pointer",
  },
};
