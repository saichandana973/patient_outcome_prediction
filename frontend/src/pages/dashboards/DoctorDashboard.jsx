// src/pages/dashboards/DoctorDashboard.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Navbar from "../../components/Navbar";
import {
  User,
  Bell,
  Clock,
  Settings,
  LogOut,
  Activity,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

/**
 * DoctorDashboard.jsx
 * - Same UI/appearance as requested
 * - Extracted shared styles, simplified inline repetition
 * - Keeps Profile, Notifications (badge), Patients, Settings, Chat
 * - Works with demo localStorage keys:
 *   - assigned_doctor_<patientId> => "<Doctor Name>"
 *   - notify_<patientId> => "doctor_assigned" (or other message)
 *   - chat_<patientId> => JSON.stringify([{ from: "patient"|"doctor", text, ts }])
 *   - doctor_online_<doctorName> => "true"/"false"
 */

export default function DoctorDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [username, setUsername] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [available, setAvailable] = useState(true);

  // Demo fallback data
  const demoAssigned = useMemo(
    () => [
      { patientId: "P103", name: "Ravi", diagnosis: "Asthma", hospital: "City Hospital" },
      { patientId: "P104", name: "Lakshmi", diagnosis: "Diabetes", hospital: "City Hospital" },
    ],
    []
  );

  useEffect(() => {
    const name = localStorage.getItem("username") || localStorage.getItem("doctorName") || "";
    setUsername(name);

    const av = localStorage.getItem(`doctor_online_${name}`);
    setAvailable(av !== "false");

    refreshAssignedPatients(name);
    refreshNotificationsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAssignedPatients = useCallback(
    (doctorName = username) => {
      const found = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith("assigned_doctor_")) {
          const pid = key.replace("assigned_doctor_", "");
          const val = localStorage.getItem(key);
          if (val === doctorName) {
            const info = localStorage.getItem(`patient_info_${pid}`);
            if (info) {
              try {
                found.push(JSON.parse(info));
              } catch {
                found.push({ patientId: pid, name: pid, diagnosis: "-" });
              }
            } else {
              found.push({ patientId: pid, name: pid, diagnosis: "-" });
            }
          }
        }
      }
      setAssignedPatients(found.length === 0 ? demoAssigned : found);
    },
    [demoAssigned, username]
  );

  const refreshNotificationsCount = useCallback(() => {
    const notes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("notify_")) notes.push(key);
    }
    setNotificationsCount(notes.length);
  }, []);

  /* ---------- styles ---------- */
  const baseSidebarStyle = {
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

  const mainStyle = {
    marginLeft: "250px",
    marginTop: "50px",
    padding: "20px 35px",
    minHeight: "calc(100vh - 70px)",
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
  };

  const cardStyle = {
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
  };

  const smallCardStyle = {
    padding: 18,
    borderRadius: 12,
    border: "1px solid #eee",
    minWidth: 220,
  };

  const tableBaseStyle = { width: "100%", borderCollapse: "collapse" };

  const inputBase = { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #e6eef8" };

  /* ---------- helpers ---------- */
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
      backgroundColor: isActive ? "#0d6efd" : isHovered ? "#edf2ff" : "transparent",
      color: isActive ? "#fff" : "#222",
      boxShadow: isActive
        ? "0 6px 18px rgba(13,110,253,0.14)"
        : isHovered
        ? "0 6px 14px rgba(32,33,36,0.06)"
        : "none",
      transform: transformParts.join(" "),
      position: "relative",
    };
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "/";
  }, []);

  /* ---------- Chat utils ---------- */
  function loadChat(patientId) {
    const raw = localStorage.getItem(`chat_${patientId}`);
    if (!raw) {
      setChatMessages([]);
      return;
    }
    try {
      const arr = JSON.parse(raw);
      setChatMessages(Array.isArray(arr) ? arr : []);
    } catch {
      setChatMessages([]);
    }
  }

  function saveChat(patientId, messages) {
    localStorage.setItem(`chat_${patientId}`, JSON.stringify(messages));
  }

  function openChatWithPatient(p) {
    setSelectedPatient(p);
    setActivePage("chat");
    loadChat(p.patientId);
  }

  function sendMessage() {
    if (!selectedPatient) return;
    if (!chatInput.trim()) return;
    const msg = { from: "doctor", text: chatInput.trim(), ts: Date.now() };
    const next = [...chatMessages, msg];
    setChatMessages(next);
    saveChat(selectedPatient.patientId, next);
    setChatInput("");
    localStorage.setItem(`notify_${selectedPatient.patientId}`, "doctor_replied");
    refreshNotificationsCount();
  }

  function getNotifications() {
    const notes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("notify_")) {
        const pid = key.replace("notify_", "");
        notes.push({ key, patientId: pid, message: localStorage.getItem(key) });
      }
    }
    return notes.reverse();
  }

  /* ---------- page components ---------- */
  const BackButton = ({ onClick }) => (
    <button
      onClick={onClick || (() => setActivePage("dashboard"))}
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

  const DoctorDashboardContent = () => (
    <div>
      <h2 style={{ marginBottom: 10, color: "#0d6efd", fontSize: 26, fontWeight: 700 }}>
        Welcome, {username || "Doctor"} 👋
      </h2>

      <div style={{ marginBottom: 18, color: "#444" }}>
        Toggle your availability so admins and patients know whether you are online.
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 26 }}>
        <div style={{ ...smallCardStyle, background: available ? "#ecfdf5" : "#fff7ed" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Availability</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ fontWeight: 800, color: available ? "#059669" : "#d97706" }}>
              {available ? "Online" : "Offline"}
            </div>
            <button
              onClick={() => {
                const newVal = !available;
                setAvailable(newVal);
                localStorage.setItem(`doctor_online_${username}`, newVal ? "true" : "false");
                refreshAssignedPatients(username);
              }}
              style={{
                background: available ? "#059669" : "#d97706",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Set {available ? "Offline" : "Online"}
            </button>
          </div>
        </div>

        <div style={smallCardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>My Patients</div>
          <div style={{ color: "#555" }}>{assignedPatients.length} patient(s) assigned</div>
        </div>

        <div style={smallCardStyle}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Consults</div>
          <div style={{ color: "#555" }}>Open chat to answer patient queries</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>Assigned Patients</div>

          <table style={tableBaseStyle}>
            <thead style={{ textAlign: "left", color: "#666", fontSize: 13 }}>
              <tr>
                <th style={{ padding: 10 }}>Patient ID</th>
                <th style={{ padding: 10 }}>Name</th>
                <th style={{ padding: 10 }}>Diagnosis</th>
                <th style={{ padding: 10 }} />
              </tr>
            </thead>
            <tbody>
              {assignedPatients.map((p) => (
                <tr key={p.patientId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: 10, fontWeight: 700 }}>{p.patientId}</td>
                  <td style={{ padding: 10 }}>{p.name || "-"}</td>
                  <td style={{ padding: 10 }}>{p.diagnosis || "-"}</td>
                  <td style={{ padding: 10, textAlign: "right" }}>
                    <button
                      onClick={() => openChatWithPatient(p)}
                      style={{
                        background: "#0d6efd",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Open Chat
                    </button>
                  </td>
                </tr>
              ))}
              {assignedPatients.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: 12, color: "#666" }}>
                    No patients assigned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={cardStyle}>
          <div style={{ fontWeight: 800, marginBottom: 12 }}>Quick Actions</div>

          <div style={{ display: "flex", gap: 12, flexDirection: "column" }}>
            <button
              onClick={() => setActivePage("patients")}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #e6eef8", cursor: "pointer", fontWeight: 700 }}
            >
              View Patients
            </button>
            <button
              onClick={() => {
                setActivePage("notifications");
                refreshNotificationsCount();
              }}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #e6eef8", cursor: "pointer", fontWeight: 700 }}
            >
              View Notifications ({notificationsCount})
            </button>
            <button
              onClick={() => setActivePage("profile")}
              style={{ padding: 12, borderRadius: 8, border: "1px solid #e6eef8", cursor: "pointer", fontWeight: 700 }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatPage = () => {
    if (!selectedPatient) {
      return (
        <div>
          <BackButton />
          <h2>Open Chat</h2>
          <p>No patient selected. Go to Patients and choose one to chat.</p>
        </div>
      );
    }
    return (
      <div>
        <BackButton onClick={() => { setSelectedPatient(null); setActivePage("dashboard"); }} />
        <h2>Chat with {selectedPatient.name || selectedPatient.patientId}</h2>

        <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
          <div style={{ flex: 1, minHeight: 320, ...cardStyle }}>
            <div style={{ height: 320, overflowY: "auto", paddingRight: 8 }}>
              {chatMessages.length === 0 && <div style={{ color: "#666" }}>No messages yet. You can start the chat.</div>}
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: m.from === "doctor" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{
                    background: m.from === "doctor" ? "#0d6efd" : "#f1f5f9",
                    color: m.from === "doctor" ? "#fff" : "#111",
                    padding: "10px 12px",
                    borderRadius: 10,
                    maxWidth: "78%",
                    fontSize: 14,
                    lineHeight: 1.3,
                  }}>
                    <div style={{ fontSize: 12, color: m.from === "doctor" ? "rgba(255,255,255,0.9)" : "#444" }}>{m.text}</div>
                    <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7, textAlign: "right" }}>{new Date(m.ts).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to patient..."
                style={{ ...inputBase }}
                onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              />
              <button onClick={sendMessage} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8 }}>
                Send
              </button>
            </div>
          </div>

          <div style={{ width: 280 }}>
            <div style={cardStyle}>
              <div style={{ fontWeight: 800 }}>Patient Info</div>
              <div style={{ marginTop: 8 }}><strong>ID:</strong> {selectedPatient.patientId}</div>
              <div style={{ marginTop: 6 }}><strong>Name:</strong> {selectedPatient.name}</div>
              <div style={{ marginTop: 6 }}><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</div>
              <div style={{ marginTop: 6 }}><strong>Hospital:</strong> {selectedPatient.hospital || "-"}</div>

              <div style={{ marginTop: 12 }}>
                <button onClick={() => {
                  const txt = (chatMessages || []).map(m => `${m.from.toUpperCase()}: ${m.text} (${new Date(m.ts).toLocaleString()})`).join("\n");
                  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `chat_${selectedPatient.patientId}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }} style={{ marginTop: 12, background: "#10b981", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}>
                  Download Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const PatientsPage = () => (
    <div>
      <BackButton />
      <h2>My Patients</h2>
      <p>Click a patient to open consult chat.</p>

      <div style={{ marginTop: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 6px 8px rgba(0,0,0,0.04)" }}>
          <thead style={{ background: "#fafbfd" }}>
            <tr>
              <th style={{ padding: 12, textAlign: "left" }}>Patient ID</th>
              <th style={{ padding: 12, textAlign: "left" }}>Name</th>
              <th style={{ padding: 12, textAlign: "left" }}>Diagnosis</th>
              <th style={{ padding: 12, textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignedPatients.map(p => (
              <tr key={p.patientId} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: 12, fontWeight: 700 }}>{p.patientId}</td>
                <td style={{ padding: 12 }}>{p.name}</td>
                <td style={{ padding: 12 }}>{p.diagnosis}</td>
                <td style={{ padding: 12 }}>
                  <button onClick={() => openChatWithPatient(p)} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}>
                    Chat
                  </button>
                </td>
              </tr>
            ))}
            {assignedPatients.length === 0 && <tr><td colSpan={4} style={{ padding: 12, color: "#666" }}>No patients assigned.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const NotificationsPage = () => {
    const notes = getNotifications();
    return (
      <div>
        <BackButton />
        <h2>🔔 Notifications</h2>
        <p>Notifications (localStorage demo). Clear when handled.</p>

        <div style={{ marginTop: 12 }}>
          {notes.length === 0 ? (
            <div style={{ color: "#666" }}>No notifications.</div>
          ) : (
            notes.map(n => (
              <div key={n.key} style={{ background: "#fbfdff", padding: 12, borderRadius: 8, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.patientId}</div>
                  <div style={{ color: "#555", marginTop: 6 }}>{n.message}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => { setActivePage("chat"); setSelectedPatient({ patientId: n.patientId, name: n.patientId }); loadChat(n.patientId); }} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 8 }}>Open</button>
                  <button onClick={() => { localStorage.removeItem(n.key); refreshNotificationsCount(); }} style={{ background: "#fff", border: "1px solid #e6eef8", padding: "8px 12px", borderRadius: 8 }}>Clear</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const Profile = () => {
    const [email, setEmail] = useState(localStorage.getItem("doctor_email") || "");
    const [phone, setPhone] = useState(localStorage.getItem("doctor_phone") || "");
    return (
      <div>
        <BackButton />
        <h2>👤 Profile</h2>
        <div style={{ maxWidth: 640 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Name</label>
            <input value={username} disabled style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Phone</label>
            <input value={phone} onChange={(e)=>setPhone(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e6eef8" }} />
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={() => { localStorage.setItem("doctor_email", email); localStorage.setItem("doctor_phone", phone); alert("Profile saved (local)."); }} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8 }}>Save Profile</button>
          </div>
        </div>
      </div>
    );
  };

  const SettingsPage = () => {
    const [autoReply, setAutoReply] = useState(localStorage.getItem("doctor_auto_reply") === "true");
    return (
      <div>
        <BackButton />
        <h2>⚙️ Settings</h2>
        <div style={{ maxWidth: 720 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input type="checkbox" checked={autoReply} onChange={(e)=>{ setAutoReply(e.target.checked); localStorage.setItem("doctor_auto_reply", e.target.checked ? "true" : "false"); }} />
            Enable auto-reply when offline (demo)
          </label>

          <div style={{ marginTop: 12 }}>
            <button onClick={()=>alert("Settings saved (local).")} style={{ background: "#0d6efd", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8 }}>Save Settings</button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DoctorDashboardContent />;
      case "patients":
        return <PatientsPage />;
      case "chat":
        return <ChatPage />;
      case "notifications":
        return <NotificationsPage />;
      case "profile":
        return <Profile />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DoctorDashboardContent />;
    }
  };

  const sidebarItems = [
    { page: "profile", label: "Profile", icon: <User size={16} /> },
    { page: "notifications", label: "Notifications", icon: <Bell size={16} />, badge: notificationsCount },
    { page: "patients", label: "Patients", icon: <Clock size={16} /> },
    { page: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <>
      <Navbar />
      <aside style={baseSidebarStyle}>
        <div>
          {sidebarItems.map(item => (
            <button
              key={item.page}
              onClick={() => {
                setActivePage(item.page);
                if (item.page === "notifications") refreshNotificationsCount();
              }}
              onMouseEnter={() => setHovered(item.page)}
              onMouseLeave={() => setHovered(null)}
              style={sidebarButtonStyle(item.page)}
            >
              {item.icon}
              <span style={{ marginLeft: 6 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ position: "absolute", right: 12, top: 10, background: "#dc3545", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{item.badge}</span>}
            </button>
          ))}
        </div>

        <div>
          <button onClick={handleLogout} onMouseEnter={() => setHovered("logout")} onMouseLeave={() => setHovered(null)} style={sidebarButtonStyle("logout")}>
            <LogOut size={16} />
            <span style={{ marginLeft: 6 }}>Logout</span>
          </button>
        </div>
      </aside>

      <main style={mainStyle}>
        {renderContent()}
      </main>
    </>
  );
}
