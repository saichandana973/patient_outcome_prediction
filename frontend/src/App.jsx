// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import WelcomePage from "./pages/WelcomePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Demo from "./pages/Demo";
import Navbar from "./components/Navbar";
import UserDashboard from "./pages/dashboards/UserDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard"; // ✅ Doctor dashboard import
import "./App.css";

function AuthApp() {
  const [users, setUsers] = useState({}); // registration data stored here while app runs
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load login state from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const adminFlag = localStorage.getItem("isAdmin") === "true";
    setIsLoggedIn(loggedIn);
    setIsAdmin(adminFlag);
    // If there's a saved users map in session (unlikely across reloads), load it
    // Note: we keep users in memory from registration; if you want persistence, store users in localStorage or backend.
    try {
      const savedUsers = localStorage.getItem("app_users_v1");
      if (savedUsers) setUsers(JSON.parse(savedUsers));
    } catch (e) {
      // ignore
    }
  }, []);

  // When users change (e.g. after registration), save to localStorage so page reloads keep them temporarily
  useEffect(() => {
    try {
      localStorage.setItem("app_users_v1", JSON.stringify(users));
    } catch (e) {
      // ignore
    }
  }, [users]);

  /**
   * handleLoginSuccess
   * @param {string} username
   * @param {boolean} adminFlag
   *
   * Note: Login component should call this with (username, isAdmin) for admin logins.
   * For regular users, Login calls with (username, false). We then check `users` for role
   * and store the role in localStorage as well so routing can persist.
   */
  const handleLoginSuccess = (username, adminFlag = false) => {
    // set auth flags
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("isAdmin", adminFlag ? "true" : "false");
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setIsAdmin(adminFlag);

    // determine role from users map if available
    const maybeUser = users && users[username] ? users[username] : null;
    const roleFromMap = maybeUser ? maybeUser.role : null;

    if (roleFromMap) {
      localStorage.setItem("role", roleFromMap);
    } else {
      // if no users map entry, attempt to keep existing local role (if any) or clear
      if (!localStorage.getItem("role")) localStorage.removeItem("role");
    }

    // Redirect: admin -> admin dashboard, doctor -> doctor dashboard, else user dashboard
    if (adminFlag) {
      navigate("/admin/dashboard");
    } else if (roleFromMap === "Doctor" || localStorage.getItem("role") === "Doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // Register success
  const handleRegisterSuccess = () => {
    navigate("/login");
  };

  // Logout: clear login-only keys (keep app_users_v1 if you want registrations to persist)
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
  };

  // Hide Navbar on login/register pages
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar onLogout={handleLogout} isLoggedIn={isLoggedIn} />}

      <Routes>
        {/* Public pages */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/demo" element={<Demo />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              isAdmin ? (
                <Navigate to="/admin/dashboard" />
              ) : localStorage.getItem("role") === "Doctor" ? (
                <Navigate to="/doctor/dashboard" />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Login users={users} onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/register"
          element={
            <Register
              users={users}
              setUsers={(newUsers) => {
                // when Register updates users it will come here
                setUsers(newUsers);
              }}
              onRegisterSuccess={handleRegisterSuccess}
            />
          }
        />

        {/* User dashboard (patients/general users) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn && !isAdmin && localStorage.getItem("role") !== "Doctor" ? (
              <UserDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Doctor dashboard */}
        <Route
          path="/doctor/dashboard"
          element={
            isLoggedIn && !isAdmin && (localStorage.getItem("role") === "Doctor" || (users[localStorage.getItem("username")] && users[localStorage.getItem("username")].role === "Doctor")) ? (
              <DoctorDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            isLoggedIn && isAdmin ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AuthApp />;
}
