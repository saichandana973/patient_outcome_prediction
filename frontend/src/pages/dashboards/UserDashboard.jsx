// src/pages/dashboards/UserDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  User,
  Bell,
  Clock,
  Settings,
  LogOut,
  Activity,
  Stethoscope,
  FileText,
  Brain,
  ArrowLeft,
  X,
} from "lucide-react";

// <-- Make sure these components exist at these paths:
import PredictionPage from "../../components/PredictionPage";
import DoctorChat from "../../components/DoctorChat";
import Analysis from "../../components/Analysis";

export default function UserDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [contentKey, setContentKey] = useState(0);
  const [username, setUsername] = useState("");
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    // refresh key (forces main content remount on page change)
    setContentKey((k) => k + 1);

    // ✅ Updated username retrieval logic

    let storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername.includes("@")) {
      storedUsername = storedUsername.split("@")[0];
    } else if (!storedUsername && localStorage.getItem("email")) {
      storedUsername = localStorage.getItem("email").split("@")[0];
    } else if (!storedUsername) {
      storedUsername = "User";
    }


    if (storedUsername) {
      // ✅ Capitalize first letter for clean display
      const formatted =
        storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1);
      setUsername(formatted);
    }

    // notifications: doctor assigned -> localStorage key "assignedDoctor"
    setHasNotification(Boolean(localStorage.getItem("assignedDoctor")));

    // watch localStorage updates (for notifications & reports)
    const onStorage = (e) => {
      if (e.key === "assignedDoctor") setHasNotification(Boolean(e.newValue));
      if (e.key === "userReports") setContentKey((k) => k + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activePage]);

  /* ---------- Styles ---------- */
  const sidebarStyle = {
    width: "230px",
    height: "calc(100vh - 70px)",
    position: "fixed",
    top: "70px",
    left: 0,
    backgroundColor: "#f8f9fa",
    padding: "18px 12px",
    boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    zIndex: 5,
  };

  const mainContentStyle = {
    marginLeft: "250px",
    marginTop: "50px",
    padding: "20px 35px",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
  };

  const sidebarButtonStyle = (page) => {
    const isActive = activePage === page;
    const isHovered = hovered === page;
    const isClicked = clicked === page;
    const transformParts = [];
    if (isClicked) transformParts.push("translateX(8px) scale(0.98)");
    else if (isHovered) transformParts.push("translateX(4px) scale(1.01)");
    else transformParts.push("translateX(0) scale(1)");

    return {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      position: "relative",
      width: "100%",
      padding: "12px 14px",
      margin: "8px 0",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      textAlign: "left",
      fontWeight: 600,
      fontSize: 15,
      transition: "all 220ms cubic-bezier(.2,.9,.2,1)",
      backgroundColor: isActive
        ? "#0d6efd"
        : isHovered
        ? "#edf2ff"
        : "transparent",
      color: isActive ? "#fff" : "#222",
      boxShadow: isActive
        ? "0 6px 18px rgba(13,110,253,0.14)"
        : isHovered
        ? "0 6px 14px rgba(32,33,36,0.06)"
        : "none",
      transform: transformParts.join(" "),
    };
  };

  /* ---------- UI helpers ---------- */
  const BackButton = () => (
    <button
      onClick={() => setActivePage("dashboard")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#e9ecef",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        padding: "8px 14px",
        fontSize: "15px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        marginBottom: "20px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#d0d7ff";
        e.currentTarget.style.transform = "translateX(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#e9ecef";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <ArrowLeft size={18} /> Back
    </button>
  );

  const Card = ({ icon, title, color, onClick }) => (
    <div
      onClick={onClick}
      style={{
        backgroundColor: "#f9fafb",
        borderRadius: "18px",
        padding: "55px 25px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 220ms cubic-bezier(.2,.9,.2,1)",
        userSelect: "none",
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px)";
        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ color, marginBottom: 18 }}>{icon}</div>
      <h3 style={{ fontSize: 20, color: "#222", margin: 0, fontWeight: 700 }}>
        {title}
      </h3>
    </div>
  );

  /* ---------- Page components ---------- */
  const DashboardContent = () => (
    <div>
      <h2
        style={{
          marginBottom: 14,
          color: "#0d6efd",
          fontSize: "26px",
          fontWeight: 700,
        }}
      >
        Welcome, {username || "User"} 👋
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
          paddingTop: "6px",
          alignItems: "stretch",
        }}
      >
        <Card
          icon={<Activity size={64} />}
          title="Prediction"
          color="#0d6efd"
          onClick={() => setActivePage("predict")}
        />
        <Card
          icon={<Stethoscope size={64} />}
          title="Doctor Consult"
          color="#28a745"
          onClick={() => setActivePage("doctor")}
        />
        <Card
          icon={<FileText size={64} />}
          title="Reports"
          color="#ffc107"
          onClick={() => setActivePage("history")}
        />
        <Card
          icon={<Brain size={64} />}
          title="Analysis"
          color="#17a2b8"
          onClick={() => setActivePage("analysis")}
        />
      </div>
    </div>
  );

  // ---- Profile Component ----
  const Profile = () => {
    const [profile, setProfile] = useState({
      name: localStorage.getItem("username") || "",
      patientId: localStorage.getItem("patientId") || "",
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || "",
    });
    const handleChange = (e) =>
      setProfile({ ...profile, [e.target.name]: e.target.value });
    const saveProfile = () => {
      Object.entries(profile).forEach(([k, v]) => localStorage.setItem(k, v));
      alert("Profile saved");
    };
    return (
      <div>
        <BackButton />
        <h2>👤 Profile</h2>
        <div style={{ marginTop: 20, maxWidth: 560 }}>
          {["name", "patientId", "email", "phone"].map((key) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                name={key}
                value={profile[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <button
              onClick={saveProfile}
              style={{
                background: "#0d6efd",
                color: "#fff",
                padding: "10px 16px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Notifications = () => {
    const [assignedDoctor, setAssignedDoctor] = useState(null);
    useEffect(() => {
      setAssignedDoctor(localStorage.getItem("assignedDoctor"));
    }, []);
    return (
      <div>
        <BackButton />
        <h2>🔔 Notifications</h2>
        {assignedDoctor ? (
          <div
            style={{
              marginTop: 20,
              background: "#e9f8ec",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #b7eb8f",
              maxWidth: 700,
            }}
          >
            <div style={{ fontWeight: 800 }}>Doctor Assigned</div>
            <div style={{ marginTop: 8 }}>
              Doctor <strong>{assignedDoctor}</strong> has been assigned to your
              case. Please go to <strong>Doctor Consult</strong> to start chat.
            </div>
          </div>
        ) : (
          <p style={{ color: "#666", marginTop: 20 }}>
            No notifications yet. You’ll be notified once an admin assigns a
            doctor.
          </p>
        )}
      </div>
    );
  };

  const Reports = () => {
    const [reports, setReports] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
      const saved = JSON.parse(localStorage.getItem("userReports") || "[]");
      setReports(saved.slice().reverse());
    }, [contentKey]);

    return (
      <div>
        <BackButton />
        <h2>📜 Reports</h2>

        {reports.length === 0 ? (
          <p style={{ color: "#666", marginTop: 20 }}>
            No reports available yet. After prediction, use Download Report to
            save here (demo uses localStorage).
          </p>
        ) : (
          <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
            {reports.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "#f9fafb",
                  borderRadius: 10,
                  padding: 12,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ maxWidth: "72%" }}>
                  <div style={{ fontWeight: 700 }}>
                    Patient ID: {r.patientId}
                  </div>
                  <div style={{ fontSize: 14, color: "#555" }}>
                    {r.diagnosis || "-"} — LOS: {r.los ?? "-"} days | Mortality:{" "}
                    {r.mortality ?? "-"}%
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#777",
                      marginTop: 6,
                    }}
                  >
                    Generated: {r.generatedAt || "-"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setSelected(r)}
                    style={{
                      background: "#0d6efd",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    📄 View
                  </button>

                  <button
                    onClick={() => {
                      const txt =
                        r.text ||
                        [
                          `Patient Report - ${r.patientId}`,
                          `Diagnosis: ${r.diagnosis}`,
                          `LOS: ${r.los}`,
                          `Mortality: ${r.mortality}%`,
                          `Generated: ${r.generatedAt}`,
                        ].join("\n");
                      const blob = new Blob([txt], {
                        type: "text/plain;charset=utf-8",
                      });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `patient_report_${r.patientId}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selected && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 18,
                borderRadius: 10,
                width: 720,
                maxHeight: "80vh",
                overflowY: "auto",
                boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>Patient Report</h3>
                <X
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(null)}
                />
              </div>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  marginTop: 12,
                  background: "#f7f8fa",
                  padding: 12,
                  borderRadius: 6,
                }}
              >
                {selected.text || JSON.stringify(selected, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const SettingsPage = () => {
    const [prefs, setPrefs] = useState({
      theme: localStorage.getItem("pref_theme") || "light",
      emailAlerts: localStorage.getItem("pref_emailAlerts") === "true",
      smsAlerts: localStorage.getItem("pref_smsAlerts") === "true",
    });
    const save = () => {
      localStorage.setItem("pref_theme", prefs.theme);
      localStorage.setItem("pref_emailAlerts", String(prefs.emailAlerts));
      localStorage.setItem("pref_smsAlerts", String(prefs.smsAlerts));
      alert("Settings saved!");
    };
    return (
      <div>
        <BackButton />
        <h2>⚙️ Settings</h2>
        <div
          style={{
            marginTop: 16,
            maxWidth: 520,
            display: "grid",
            gap: 14,
          }}
        >
          <div>
            <label
              style={{
                fontWeight: 600,
                display: "block",
                marginBottom: 6,
              }}
            >
              Theme
            </label>
            <select
              value={prefs.theme}
              onChange={(e) =>
                setPrefs({ ...prefs, theme: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              id="emailAlerts"
              type="checkbox"
              checked={prefs.emailAlerts}
              onChange={(e) =>
                setPrefs({ ...prefs, emailAlerts: e.target.checked })
              }
            />
            <label htmlFor="emailAlerts">
              Email alerts when doctor assigned
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              id="smsAlerts"
              type="checkbox"
              checked={prefs.smsAlerts}
              onChange={(e) =>
                setPrefs({ ...prefs, smsAlerts: e.target.checked })
              }
            />
            <label htmlFor="smsAlerts">
              SMS alerts when doctor assigned
            </label>
          </div>

          <div>
            <button
              onClick={save}
              style={{
                background: "#0d6efd",
                color: "#fff",
                padding: "10px 16px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Doctor = () => (
    <DoctorChat backToDashboard={() => setActivePage("dashboard")} />
  );

  const AnalysisPage = () => (
    <Analysis backToDashboard={() => setActivePage("dashboard")} />
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const handleSidebarClick = (page) => {
    if (page === "notifications") setHasNotification(false);
    setClicked(page);
    setActivePage(page);
    setTimeout(() => setClicked(null), 200);
  };

  const sidebarItems = [
    { page: "profile", label: "Profile", icon: <User size={16} /> },
    { page: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { page: "history", label: "Reports", icon: <Clock size={16} /> },
    { page: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "profile":
        return <Profile />;
      case "notifications":
        return <Notifications />;
      case "history":
        return <Reports />;
      case "settings":
        return <SettingsPage />;
      case "predict":
        return (
          <PredictionPage backToDashboard={() => setActivePage("dashboard")} />
        );
      case "doctor":
        return <Doctor />;
      case "analysis":
        return <AnalysisPage />;
      case "logout":
        handleLogout();
        return null;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <>
      <Navbar />
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div>
          {sidebarItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleSidebarClick(item.page)}
              onMouseEnter={() => setHovered(item.page)}
              onMouseLeave={() => setHovered(null)}
              style={sidebarButtonStyle(item.page)}
            >
              {item.icon}
              <span style={{ marginLeft: 8 }}>{item.label}</span>

              {item.page === "notifications" && hasNotification && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "10px",
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 11,
                    padding: "3px 7px",
                    borderRadius: 999,
                    fontWeight: 800,
                  }}
                >
                  ●
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => handleSidebarClick("logout")}
            onMouseEnter={() => setHovered("logout")}
            onMouseLeave={() => setHovered(null)}
            style={sidebarButtonStyle("logout")}
          >
            <LogOut size={16} />
            <span style={{ marginLeft: 6 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={mainContentStyle} key={contentKey}>
        {renderContent()}
      </main>
    </>
  );
}
