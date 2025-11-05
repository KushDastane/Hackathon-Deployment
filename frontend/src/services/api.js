import axios from "axios";

// Use explicit backend URL
const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://ambulancemanagement-u67j.onrender.com/api"
    : "http://localhost:5000/api");

console.log("🔧 API Base URL:", API_BASE_URL); // Debug log

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.code === "ECONNREFUSED") {
      console.error("💡 Backend connection refused. Please check:");
      console.error("   1. Is the backend server running?");
      console.error("   2. Run: cd backend && npm start");
      console.error("   3. Check if port 5000 is available");
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Don't redirect automatically, let component handle it
      console.log("🔐 Token expired or invalid");
    }

    return Promise.reject(error);
  }
);

// Test backend connection
export const testBackendConnection = async () => {
  try {
    const response = await api.get("/health");
    console.log("✅ Backend connection test:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Backend connection test failed:", error.message);
    return {
      success: false,
      error: error.message,
      details: "Make sure backend is running on port 5000",
    };
  }
};

// Auth services
export const authService = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }),

  getCurrentUser: () => api.get("/auth/me"),

  register: (userData) => api.post("/auth/register", userData),
};

// Patient services
export const patientService = {
  getAll: () => api.get("/patients"),

  getById: (id) => api.get(`/patients/${id}`),

  create: (patientData) => api.post("/patients", patientData),

  updateVitals: (id, vitals) => api.post(`/patients/${id}/vitals`, vitals),

  getCritical: () => api.get("/patients/alerts/critical"),
};

// Ambulance services
export const ambulanceService = {
  getAll: () => api.get("/ambulances"),

  getById: (id) => api.get(`/ambulances/${id}`),
};

export default api;
