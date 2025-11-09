import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";

// Images – confirm all these exist in /src/assets/
import HomePageImg from "../assets/home_page.jpg";
import AIPoweredImg from "../assets/ai_powered.jpg";
import RealTimeImg from "../assets/real_time.jpg";
import SecureImg from "../assets/secure.jpg";
import OurMissionImg from "../assets/our_mission.jpg";

export default function WelcomePage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (location.state?.openLogin) setShowLogin(true);
  }, [location.state]);

  const handleStartDemo = () => navigate("/demo");
  const handleAboutUs = () => navigate("/aboutus");

  const features = [
    {
      title: "AI-Powered Analysis",
      desc: "Our AI reviews patient data and highlights what matters most. Doctors get clear insights, making decisions faster and simpler.",
      img: AIPoweredImg,
    },
    {
      title: "Real-Time Insights",
      desc: "Patient data is monitored continuously, instantly alerting doctors to changes. Timely care ensures better patient outcomes.",
      img: RealTimeImg,
    },
    {
      title: "Secure & Reliable",
      desc: "All patient data is protected with top-level security and privacy. Doctors focus on care while data stays confidential.",
      img: SecureImg,
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff" }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "85vh",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 100px",
          background: "linear-gradient(to right, #e3f2fd, #ffffff)",
        }}
      >
        {/* Left Hero Text */}
        <div style={{ flex: "1 1 500px", maxWidth: "550px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "700", color: "#0d47a1", lineHeight: "1.3" }}>
            Empowering Healthcare with Predictive Intelligence
          </h1>
          <p style={{ fontSize: "20px", marginTop: "20px" }}>
            Welcome to the <b>Patient Outcome Prediction System</b> — an advanced AI platform
            designed to assist healthcare professionals in predicting ICU patient outcomes.
          </p>
          <button
            onClick={handleStartDemo}
            style={{
              marginTop: "30px",
              padding: "12px 32px",
              fontSize: "16px",
              borderRadius: "30px",
              border: "none",
              backgroundColor: "#4caf50",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#43a047";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#4caf50";
              e.target.style.transform = "scale(1)";
            }}
          >
            Start Demo →
          </button>

          {showLogin && (
            <div style={{ marginTop: "40px", maxWidth: "400px" }}>
              <Login users={props.users} onLoginSuccess={props.onLoginSuccess} />
            </div>
          )}
        </div>

        {/* Right Hero Image */}
        <div
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "50px",
          }}
        >
          <img
            src={HomePageImg}
            alt="Healthcare AI"
            style={{
              width: "100%",
              maxWidth: "450px",
              borderRadius: "30px",
              objectFit: "cover",
              aspectRatio: "9/12",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: "#f8f9fa", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "32px", color: "#0d47a1" }}>Why Choose Our System?</h2>
        <p style={{ fontSize: "18px", maxWidth: "800px", margin: "20px auto" }}>
          Our AI helps doctors make ICU care easier, faster, and safer, giving every patient the attention they deserve.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {features.map((item, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 300px",
                maxWidth: "340px",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderTopLeftRadius: "16px",
                  borderTopRightRadius: "16px",
                }}
              />
              <div style={{ padding: "20px" }}>
                <h3 style={{ color: "#0d47a1", fontWeight: "600", marginBottom: "12px" }}>{item.title}</h3>
                <p style={{ fontSize: "16px", textAlign: "justify" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission Section */}
      <section
        style={{
          background: "linear-gradient(to bottom, #2d80bbff, #ffffff)",
          padding: "80px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "22px",
            boxShadow: "0 8px 22px rgba(0,0,0,0.15)",
            padding: "50px",
            maxWidth: "950px",
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Text */}
          <div style={{ flex: "1 1 500px" }}>
            <h2 style={{ color: "#0d47a1", fontSize: "36px", fontWeight: "700" }}>Our Mission</h2>
            <p style={{ fontSize: "19px", marginTop: "18px", lineHeight: "1.7", color: "#333" }}>
              We believe technology should make healthcare simpler and more caring. Our
              goal is to support doctors with quick, clear insights so they can focus on
              what matters most — saving lives. With smart AI, we help patients get faster
              decisions, better care, and a safer recovery.
            </p>
            <div style={{ textAlign: "center", marginTop: "35px" }}>
              <button
                onClick={handleAboutUs}
                style={{
                  backgroundColor: "#1976a8ff",
                  color: "white",
                  border: "none",
                  padding: "14px 42px",
                  fontSize: "18px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#6a9db6ff";
                  e.target.style.transform = "scale(1.07)";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#97c5ddff";
                  e.target.style.transform = "scale(1)";
                }}
              >
                About Us →
              </button>
            </div>
          </div>

          {/* Image */}
          <div style={{ flex: "1 1 300px", textAlign: "center" }}>
            <img
              src={OurMissionImg}
              alt="Mission"
              style={{
                width: "270px",
                height: "270px",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "linear-gradient(135deg, #dbeafe, #eff6ff)",
          color: "#0d47a1",
          padding: "40px 30px 25px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "25px",
          borderTop: "3px solid #f0f3f0ff",
        }}
      >
        {/* About Us Section */}
        <div style={{ flex: "1 1 280px", minWidth: "230px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "12px", color: "#0d47a1" }}>
            Patient Outcome Predictor
          </h3>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "black", opacity: "0.9" }}>
            Empowering doctors with AI-driven insights to make smarter, faster
            ICU decisions. Our mission is to improve patient recovery and reduce
            delays through technology and compassion.
          </p>
        </div>

        {/* Quick Links Section */}
        <div style={{ flex: "1 1 160px", minWidth: "180px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "12px", color: "#0d47a1" }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", lineHeight: "1.8" }}>
            <li><a href="/" style={{ color: "black", textDecoration: "none" }}>Home</a></li>
            <li><a href="/aboutus" style={{ color: "black", textDecoration: "none" }}>About Us</a></li>
            <li><a href="/demo" style={{ color: "black", textDecoration: "none" }}>Demo</a></li>
            <li><a href="/contactus" style={{ color: "black", textDecoration: "none" }}>Contact Us</a></li>
            <li><a href="/login" style={{ color: "black", textDecoration: "none" }}>Login</a></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div style={{ flex: "1 1 250px", minWidth: "230px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "12px", color: "#0d47a1" }}>
            Contact Us
          </h4>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "black", opacity: "0.9" }}>
            📧 <b>Email:</b> eicug621@gmail.com<br />
            ☎ <b>Phone:</b> +91 98765 43210 <br />
            🕒 <b>Hours:</b> Mon–Fri, 9:00 AM – 6:00 PM
          </p>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <a href="#" style={{ color: "#0d47a1", fontSize: "18px" }}>🌐</a>
            <a href="#" style={{ color: "#0d47a1", fontSize: "18px" }}>💼</a>
            <a href="#" style={{ color: "#0d47a1", fontSize: "18px" }}>📘</a>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            width: "100%",
            textAlign: "center",
            borderTop: "1px solid rgba(0,0,0,0.1)",
            marginTop: "25px",
            paddingTop: "10px",
            fontSize: "16px",
            opacity: "0.8",
          }}
        >
          <p style={{ marginBottom: "5px" }}>Together, we care. Together, we save lives.</p>
          <p>© 2025 Patient Outcome Predictor | Made with ❤ by Your Team</p>
        </div>
      </footer>
    </div>
  );
}
