// frontend/src/api/axios.ts

import axios from "axios";

// Create a new Axios instance with baseURL and default options
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // ensure trailing `/api`
  withCredentials: false, // disable cookies for token-based auth
});

// ✅ Automatically attach JWT token to Authorization header
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
