import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [arrowMove, setArrowMove] = useState(false);

  const NAV_HEIGHT = 70;

  const navbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    backgroundColor: "#0d6efd",
    color: "white",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: `${NAV_HEIGHT}px`,
    zIndex: 1000,
    boxSizing: "border-box",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
    flexShrink: 0,
  };

  const menuStyle = {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    flex: 1,
    minWidth: 0,
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const buttonStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "8px 20px",
    border: "3px solid greenyellow",
    backgroundColor: clicked ? "greenyellow" : "transparent",
    borderRadius: clicked ? "12px" : "30px",
    fontWeight: "600",
    color: clicked ? "#212121" : "greenyellow",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.4s ease",
    fontSize: "14px",
    flexShrink: 0,
  };

  const arrowStyle = {
    display: "inline-block",
    transform: arrowMove ? "translateX(8px)" : "translateX(0px)",
    transition: "transform 0.3s ease",
    fontSize: "16px",
  };

  const handleButtonClick = () => {
    setArrowMove(true);
    setClicked(true);
    setTimeout(() => navigate("/register"), 700);
  };

  return (
    <>
      <nav style={navbarStyle}>
        <div style={titleStyle} onClick={() => navigate("/")}>
          Patient Outcome Predictor
        </div>
        <div style={menuStyle}>
          <span style={linkStyle} onClick={() => navigate("/")}>
            Home
          </span>
          <span style={linkStyle} onClick={() => navigate("/aboutus")}>
            About Us
          </span>
          <span style={linkStyle} onClick={() => navigate("/login")}>
            Login
          </span>
          <span style={linkStyle} onClick={() => navigate("/demo")}>
            Demo
          </span>
          <span style={linkStyle} onClick={() => navigate("/contactus")}>
            Contact Us
          </span>
          <button style={buttonStyle} onClick={handleButtonClick}>
            Get Started <span style={arrowStyle}>→</span>
          </button>
        </div>
      </nav>

      {/* Spacer to push content below fixed navbar */}
      <div style={{ height: `${NAV_HEIGHT}px` }}></div>
    </>
  );
}
