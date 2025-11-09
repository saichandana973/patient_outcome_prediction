import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/login.jpg";
import { loginUser } from "../api"; // ✅ Import backend API

export default function Login({ onLoginSuccess }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const ADMIN_EMAIL = "eicug621@gmail.com";
  const ADMIN_PASSWORD = "kmce123$";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ----------------------------
      // 1️⃣ Admin Login
      // ----------------------------
      if (usernameOrEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        alert("✅ Welcome Admin!");
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("username", "Admin");
        if (onLoginSuccess) onLoginSuccess("Admin", true);
        setLoading(false);
        return;
      }

      // ----------------------------
      // 2️⃣ Normal User Login via Backend
      // ----------------------------
      const response = await loginUser({
        username_or_email: usernameOrEmail,
        password,
      });

      console.log("Backend Login Response:", response);

      // ✅ Extract username properly (fallback to email prefix)
      const user = response.user || {};
      const username =
        user.username && user.username.trim() !== ""
          ? user.username
          : user.email
          ? user.email.split("@")[0]
          : "User";

      // ✅ Store cleaned login details
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isAdmin", "false");
      localStorage.setItem("username", username);
      localStorage.setItem("email", user.email || "");
      localStorage.setItem("token", response.token || "");

      alert("🎉 " + (response.message || "Login successful!"));
      
      if (onLoginSuccess) onLoginSuccess(username, false); // ✅ pass username, not email
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f8f9fa",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* LEFT IMAGE SECTION */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={LoginImg}
          alt="Login Visual"
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            filter: "brightness(100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "black",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "50px",
              fontWeight: "600",
              margin: 0,
              textShadow: "0px 3px 6px rgba(0,0,0,0.3)",
              letterSpacing: "1px",
              whiteSpace: "nowrap",
            }}
          >
            Your Health, Our Priority
          </h1>
          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.5",
              color: "black",
              marginTop: "12px",
            }}
          >
            Take the first step towards a healthier, happier you. <br />
            Login to manage your wellness journey.
          </p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            backgroundColor: "#fff",
            padding: "50px",
            borderRadius: "16px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
            width: "460px",
            fontSize: "18px",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "700",
              color: "#1b4480ff",
            }}
          >
            Welcome Back!
          </h3>
          <p
            style={{
              textAlign: "center",
              marginBottom: "25px",
              color: "#555",
              fontSize: "16px",
            }}
          >
            Please login to continue your health management.
          </p>

          {error && (
            <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>
          )}

          {/* ✅ Supports Username or Email */}
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "15px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "17px",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "17px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#ccc" : "#1b5686ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "20px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "0.3s",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            style={{
              marginTop: "22px",
              fontSize: "17px",
              textAlign: "center",
              color: "#555",
            }}
          >
            New User?{" "}
            <span
              style={{
                color: "#447acbff",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={() => navigate("/register")}
            >
              Register Here
            </span>
          </p>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "#888",
              textAlign: "center",
            }}
          >
            Tip: Admins sign in directly using their admin credentials.
          </div>
        </form>
      </div>
    </div>
  );
}
