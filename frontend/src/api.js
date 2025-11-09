// frontend/src/api.js
import axios from "axios";

// Create axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // ✅ Correct base URL
  timeout: 5000,
});

// ---------------------------
// Login API
// ---------------------------
export const loginUser = async (credentials) => {
  const response = await API.post("/login", credentials);
  return response.data;
};

// ---------------------------
// Register API
// ---------------------------
export const registerUser = async (data) => {
  const response = await API.post("/register", data);
  return response.data;
};

export const sendEmailOTP = async (email) => {
  const response = await API.post("/email-otp", { email });
  return response.data;
};

export const verifyEmailOTP = async (email, otp) => {
  const response = await API.post("/verify-otp", { email, otp });
  return response.data;
};


// ---------------------------
// Contact API
// ---------------------------
export const contactUs = async (data) => {
  const response = await API.post("/contact", data);
  return response.data;
};

// ---------------------------
// Patient Outcome Prediction API
// ---------------------------
export const predictPatientOutcome = async (patientData) => {
  const response = await API.post("/predict", patientData);
  return response.data;
};
