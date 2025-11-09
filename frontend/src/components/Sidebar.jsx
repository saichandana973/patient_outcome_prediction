// frontend/src/components/Sidebar.jsx
import React from "react";
import { FaUser, FaBell, FaCog, FaHistory, FaSignOutAlt } from "react-icons/fa";
import "./../App.css";

export default function Sidebar({ isOpen, closeSidebar, onSelect }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Close Button */}
      <button className="close-btn" onClick={closeSidebar}>
        ×
      </button>

      {/* Sidebar Buttons */}
      <div className="sidebar-buttons">
        <button onClick={() => { onSelect("profile"); closeSidebar(); }}>
          <FaUser style={{ marginRight: "10px" }} /> Profile
        </button>
        <button onClick={() => { onSelect("notifications"); closeSidebar(); }}>
          <FaBell style={{ marginRight: "10px" }} /> Notifications
        </button>
        <button onClick={() => { onSelect("settings"); closeSidebar(); }}>
          <FaCog style={{ marginRight: "10px" }} /> Settings
        </button>
        <button onClick={() => { onSelect("history"); closeSidebar(); }}>
          <FaHistory style={{ marginRight: "10px" }} /> History
        </button>
        <button onClick={() => { onSelect("logout"); closeSidebar(); }}>
          <FaSignOutAlt style={{ marginRight: "10px" }} /> Logout
        </button>
      </div>
    </div>
  );
}
