// src/pages/dashboards/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import {
  User,
  Bell,
  Clock,
  Settings,
  LogOut,
  ClipboardList,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [hovered, setHovered] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [username, setUsername] = useState("Admin");

  // Dummy / initial data
  const [pendingPatients, setPendingPatients] = useState([
    { patientId: "P101", name: "Kiran", diagnosis: "Pneumonia", hospital: "City Hospital" },
    { patientId: "P102", name: "Meena", diagnosis: "Heart Disease", hospital: "Apollo" },
  ]);
  const [assignedPatients, setAssignedPatients] = useState([
    { patientId: "P103", name: "Ravi", doctor: "Dr. Sharma", diagnosis: "Asthma", status: "Assigned" },
    { patientId: "P104", name: "Lakshmi", doctor: "Dr. Anjali", diagnosis: "Diabetes", status: "Assigned" },
  ]);

  // Dummy doctors dataset — in real app fetch this from backend
  const [doctors] = useState([
    { id: "D1", name: "Dr. Sharma", hospital: "City Hospital", designation: "Physician", online: true },
    { id: "D2", name: "Dr. Anjali", hospital: "City Hospital", designation: "Cardiologist", online: false },
    { id: "D3", name: "Dr. Ramesh", hospital: "Apollo", designation: "Cardiologist", online: true },
    { id: "D4", name: "Dr. Neeta", hospital: "Apollo", designation: "Physician", online: true },
    { id: "D5", name: "Dr. Kiran", hospital: "City Hospital", designation: "Pulmonologist", online: true },
  ]);

  // Selected patient during assignment flow
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterDesignation, setFilterDesignation] = useState("");

  // Profile & settings state
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    // load admin profile (if saved)
    const savedEmail = localStorage.getItem("adminEmail");
    const savedPhone = localStorage.getItem("adminPhone");
    if (savedEmail) setAdminEmail(savedEmail);
    if (savedPhone) setAdminPhone(savedPhone);

    refreshNotificationsCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Styles / helpers ---------------- */
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

  const BackButton = () => (
    <button
      onClick={() => {
        setSelectedPatient(null);
        setFilterDesignation("");
        setActivePage("dashboard");
      }}
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
        padding: "60px 25px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 220ms cubic-bezier(.2,.9,.2,1)",
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
      <h3 style={{ fontSize: 20, color: "#222", margin: 0, fontWeight: 700 }}>{title}</h3>
    </div>
  );

  /* ---------------- Main Dashboard ---------------- */
  const DashboardContent = () => (
    <div>
      <h2 style={{ marginBottom: 20, color: "#0d6efd", fontSize: "26px", fontWeight: 700 }}>
        Welcome, {username} 👋
      </h2>
      <p style={{ color: "#444", marginBottom: 25 }}>
        Manage doctor assignments, monitor patient cases, and handle pending requests efficiently.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "32px",
          paddingTop: "6px",
        }}
      >
        <Card
          icon={<ClipboardList size={64} />}
          title="Pending Requests"
          color="#dc3545"
          onClick={() => setActivePage("pending")}
        />
        <Card
          icon={<CheckCircle size={64} />}
          title="Assigned Cases"
          color="#198754"
          onClick={() => setActivePage("assigned")}
        />
      </div>
    </div>
  );

  /* ---------------- Assignment flow helpers (unchanged) ---------------- */
  const openAssignPageForPatient = (patientId) => {
    const p = pendingPatients.find((x) => x.patientId === patientId);
    if (!p) return;
    setSelectedPatient(p);
    const diag = (p.diagnosis || "").toLowerCase();
    let suggested = "";
    if (diag.includes("heart") || diag.includes("cardio") || diag.includes("cardiac")) suggested = "Cardiologist";
    else if (diag.includes("pneumonia") || diag.includes("asthma") || diag.includes("lung")) suggested = "Pulmonologist";
    else if (diag.includes("neuro") || diag.includes("stroke") || diag.includes("brain")) suggested = "Neurologist";
    else suggested = "";
    setFilterDesignation(suggested);
    setActivePage("assign");
  };

  const confirmAssign = (doctor) => {
    if (!selectedPatient) return;
    const confirmMsg = `Assign ${doctor.name} (${doctor.designation}) to ${selectedPatient.name} (${selectedPatient.patientId})?`;
    if (!window.confirm(confirmMsg)) return;

    const newAssigned = {
      patientId: selectedPatient.patientId,
      name: selectedPatient.name,
      doctor: doctor.name,
      diagnosis: selectedPatient.diagnosis,
      status: "Assigned",
      hospital: selectedPatient.hospital,
    };
    setAssignedPatients((prev) => [newAssigned, ...prev]);
    setPendingPatients((prev) => prev.filter((p) => p.patientId !== selectedPatient.patientId));
    setSelectedPatient(null);
    setFilterDesignation("");
    setActivePage("assigned");

    try {
      localStorage.setItem(`notify_${newAssigned.patientId}`, "doctor_assigned");
      localStorage.setItem(`assigned_doctor_${newAssigned.patientId}`, doctor.name);
    } catch (e) {}
    refreshNotificationsCount();
  };

  /* ---------------- Notifications helpers ---------------- */
  function getNotificationsFromLocalStorage() {
    const notes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("notify_")) {
        const patientId = key.replace("notify_", "");
        const val = localStorage.getItem(key);
        const assignedDoctor = localStorage.getItem(`assigned_doctor_${patientId}`);
        let message = "";
        if (val === "doctor_assigned") message = `Doctor assigned: ${assignedDoctor || "TBD"}`;
        else message = val;
        notes.push({ patientId, message, key });
      }
    }
    // show latest first
    return notes.reverse();
  }

  function refreshNotificationsCount() {
    const notes = getNotificationsFromLocalStorage();
    setNotificationsCount(notes.length);
  }

  function clearNotification(key) {
    localStorage.removeItem(key);
    // also remove assigned_doctor_<id> ?
    const pid = key.replace("notify_", "");
    localStorage.removeItem(`assigned_doctor_${pid}`);
    refreshNotificationsCount();
  }

  /* ---------------- Pages: Pending / Assign / Assigned (unchanged layout mostly) ---------------- */
  const PendingRequests = () => (
    <div>
      <BackButton />
      <h2>🕓 Pending Requests</h2>
      <p>All users waiting for doctor assignment are listed below.</p>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={colStyle.id}>Patient ID</th>
            <th style={colStyle.name}>Name</th>
            <th style={colStyle.diagnosis}>Diagnosis</th>
            <th style={colStyle.hospital}>Hospital</th>
            <th style={colStyle.action}>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingPatients.map((row) => (
            <tr key={row.patientId} style={trStyle}>
              <td style={colStyle.id}>{row.patientId}</td>
              <td style={colStyle.name}>{row.name}</td>
              <td style={colStyle.diagnosis}>{row.diagnosis}</td>
              <td style={colStyle.hospital}>{row.hospital}</td>
              <td style={colStyle.action}>
                <button onClick={() => openAssignPageForPatient(row.patientId)} style={assignBtn}>
                  Assign Doctor
                </button>
              </td>
            </tr>
          ))}
          {pendingPatients.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 18, color: "#666" }}>
                No pending requests.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const AssignDoctorPage = () => {
    if (!selectedPatient) {
      return (
        <div>
          <BackButton />
          <h2>Assign Doctor</h2>
          <p>No patient selected. Go to pending requests and choose a patient to assign.</p>
        </div>
      );
    }

    const doctorsForHospital = doctors.filter((d) => d.hospital === selectedPatient.hospital);
    const filteredDoctors = filterDesignation
      ? doctorsForHospital.filter((d) => d.designation.toLowerCase().includes(filterDesignation.toLowerCase()))
      : doctorsForHospital;

    return (
      <div>
        <BackButton />
        <h2>Assign Doctor</h2>

        <div style={{ marginBottom: 16 }}>
          <strong>Patient:</strong> {selectedPatient.name} &nbsp;|&nbsp; <strong>ID:</strong> {selectedPatient.patientId} &nbsp;|&nbsp; <strong>Diagnosis:</strong> {selectedPatient.diagnosis} &nbsp;|&nbsp;
          <strong>Hospital:</strong> {selectedPatient.hospital}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
          <label style={{ fontWeight: 700 }}>Filter by designation (optional):</label>
          <input
            value={filterDesignation}
            onChange={(e) => setFilterDesignation(e.target.value)}
            placeholder="e.g. Cardiologist, Physician"
            style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #e6eef8", minWidth: 240 }}
          />
          <button
            onClick={() => setFilterDesignation("")}
            style={{ padding: "8px 12px", borderRadius: 8, cursor: "pointer", background: "#eee", border: "none" }}
          >
            Clear
          </button>
        </div>

        <p style={{ color: "#555", marginBottom: 10 }}>
          Showing doctors available at <strong>{selectedPatient.hospital}</strong>. Blue = online.
        </p>

        <table style={tableStyle}>
          <thead style={theadStyle}>
            <tr>
              <th style={colStyle.id}>Doctor ID</th>
              <th style={colStyle.name}>Name</th>
              <th style={colStyle.doctor}>Designation</th>
              <th style={colStyle.hospital}>Hospital</th>
              <th style={colStyle.status}>Status</th>
              <th style={colStyle.action}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((doc) => (
              <tr key={doc.id} style={trStyle}>
                <td style={colStyle.id}>{doc.id}</td>
                <td style={colStyle.name}>{doc.name}</td>
                <td style={colStyle.doctor}>{doc.designation}</td>
                <td style={colStyle.hospital}>{doc.hospital}</td>
                <td style={colStyle.status}>
                  <span style={{ color: doc.online ? "#0d6efd" : "#999", fontWeight: 700 }}>
                    {doc.online ? "Online" : "Offline"}
                  </span>
                </td>
                <td style={{ ...colStyle.action, textAlign: "center" }}>
                  <button
                    onClick={() => confirmAssign(doc)}
                    style={{
                      background: doc.online ? "#0d6efd" : "#6c757d",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: doc.online ? "pointer" : "not-allowed",
                      opacity: doc.online ? 1 : 0.7,
                    }}
                    disabled={!doc.online}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}

            {filteredDoctors.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 18, color: "#666" }}>
                  No doctors match the current filter in {selectedPatient.hospital}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const AssignedCases = () => (
    <div>
      <BackButton />
      <h2>✅ Assigned Cases</h2>
      <p>All cases where doctors are successfully assigned.</p>

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={colStyle.id}>Patient ID</th>
            <th style={colStyle.name}>Name</th>
            <th style={colStyle.doctor}>Doctor</th>
            <th style={colStyle.diagnosis}>Diagnosis</th>
            <th style={colStyle.status}>Status</th>
          </tr>
        </thead>
        <tbody>
          {assignedPatients.map((row) => (
            <tr key={row.patientId} style={trStyle}>
              <td style={colStyle.id}>{row.patientId}</td>
              <td style={colStyle.name}>{row.name}</td>
              <td style={colStyle.doctor}>{row.doctor}</td>
              <td style={colStyle.diagnosis}>{row.diagnosis}</td>
              <td style={{ ...colStyle.status, color: "green", fontWeight: 700 }}>{row.status}</td>
            </tr>
          ))}
          {assignedPatients.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 18, color: "#666" }}>
                No assigned cases.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  /* ---------------- Profile / Notifications / Settings ---------------- */
  const Profile = () => {
    const saveProfile = () => {
      localStorage.setItem("adminEmail", adminEmail);
      localStorage.setItem("adminPhone", adminPhone);
      alert("Profile saved.");
    };

    return (
      <div>
        <BackButton />
        <h2>👤 Profile</h2>
        <p>Manage your admin contact details (saved locally).</p>

        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Admin Username</label>
            <input value={username} disabled style={inputField} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Email</label>
            <input value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} style={inputField} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: 6 }}>Phone</label>
            <input value={adminPhone} onChange={(e) => setAdminPhone(e.target.value)} style={inputField} />
          </div>

          <div style={{ marginTop: 10 }}>
            <button onClick={saveProfile} style={primaryBtn}>
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NotificationsPage = () => {
    const notes = getNotificationsFromLocalStorage();

    return (
      <div>
        <BackButton />
        <h2>🔔 Notifications</h2>
        <p>You will be notified when a doctor is assigned. Below are stored notifications (localStorage).</p>

        <div style={{ marginTop: 12, maxWidth: 900 }}>
          {notes.length === 0 ? (
            <div style={{ padding: 12, color: "#666" }}>No notifications.</div>
          ) : (
            notes.map((n) => (
              <div
                key={n.key}
                style={{
                  background: "#fbfdff",
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{n.patientId}</div>
                  <div style={{ color: "#555", marginTop: 6 }}>{n.message}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => {
                      // open assigned case
                      const pid = n.patientId;
                      // If assigned, navigate to assigned page and highlight — here we just go to assigned.
                      setActivePage("assigned");
                      clearNotification(n.key);
                    }}
                    style={primaryBtn}
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      clearNotification(n.key);
                      alert("Notification cleared.");
                    }}
                    style={{ ...secondaryBtn, background: "#fff", border: "1px solid #e6eef8" }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const SettingsPage = () => {
    const [emailNotif, setEmailNotif] = useState(localStorage.getItem("admin_email_notif") === "true");
    const [autoAssign, setAutoAssign] = useState(localStorage.getItem("admin_auto_assign") === "true");

    useEffect(() => {
      // keep local states up-to-date when opening settings
      setEmailNotif(localStorage.getItem("admin_email_notif") === "true");
      setAutoAssign(localStorage.getItem("admin_auto_assign") === "true");
    }, []);

    const saveSettings = () => {
      localStorage.setItem("admin_email_notif", emailNotif ? "true" : "false");
      localStorage.setItem("admin_auto_assign", autoAssign ? "true" : "false");
      alert("Settings saved.");
    };

    return (
      <div>
        <BackButton />
        <h2>⚙️ Settings</h2>
        <p>Common admin settings (saved locally).</p>

        <div style={{ maxWidth: 700 }}>
          <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
            Enable email notifications (placeholder)
          </label>

          <label style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <input type="checkbox" checked={autoAssign} onChange={(e) => setAutoAssign(e.target.checked)} />
            Auto-suggest doctor assignments based on diagnosis
          </label>

          <div style={{ marginTop: 10 }}>
            <button onClick={saveSettings} style={primaryBtn}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- Utility: save and refresh notifications ---------------- */
  function refreshNotificationsCount() {
    const notes = getNotificationsFromLocalStorage();
    setNotificationsCount(notes.length);
  }

  /* ---------------- Table & layout styles (shared) ---------------- */
  const tableStyle = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    marginTop: 20,
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  };

  const theadStyle = {
    background: "#fafbfd",
  };

  const trStyle = {
    background: "#fff",
  };

  const assignBtn = {
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  };

  const colStyle = {
    id: { width: "12%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    name: { width: "22%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    doctor: { width: "22%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    diagnosis: { width: "24%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    hospital: { width: "18%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    status: { width: "12%", textAlign: "left", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
    action: { width: "14%", textAlign: "center", padding: "12px 18px", borderBottom: "1px solid #f1f5f9" },
  };

  const inputField = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #e6eef8",
    outline: "none",
    fontSize: 15,
  };

  const primaryBtn = {
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  };

  const secondaryBtn = {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  };

  /* ---------------- Render logic ---------------- */
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "pending":
        return <PendingRequests />;
      case "assign":
        return <AssignDoctorPage />;
      case "assigned":
        return <AssignedCases />;
      case "profile":
        return <Profile />;
      case "notifications":
        return <NotificationsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardContent />;
    }
  };

  /* ---------------- Sidebar items (show notification badge) ---------------- */
  const sidebarItems = [
    { page: "profile", label: "Profile", icon: <User size={16} /> },
    { page: "notifications", label: "Notifications", icon: <Bell size={16} />, badge: notificationsCount },
    { page: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <>
      <Navbar />
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <div>
          {sidebarItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                setActivePage(item.page);
                // if viewing notifications, clear the badge count refresh
                if (item.page === "notifications") {
                  refreshNotificationsCount();
                }
              }}
              onMouseEnter={() => setHovered(item.page)}
              onMouseLeave={() => setHovered(null)}
              style={sidebarButtonStyle(item.page)}
            >
              {item.icon}
              <span style={{ marginLeft: 6 }}>{item.label}</span>

              {/* small badge for notifications */}
              {item.badge > 0 && (
                <span
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    background: "#dc3545",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            onMouseEnter={() => setHovered("logout")}
            onMouseLeave={() => setHovered(null)}
            style={sidebarButtonStyle("logout")}
          >
            <LogOut size={16} />
            <span style={{ marginLeft: 6 }}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyle}>{renderContent()}</main>
    </>
  );
}
