// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyRequests from "./pages/MyRequests";
import ServiceRequestForm from "./pages/ServiceRequestForm";
import AdminRequests from "./pages/AdminRequests";
import AdminUsers from "./pages/AdminUsers";
import Landing from "./pages/Landing";

const AppContent = () => {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-6 text-center text-gray-600">Checking session...</div>;

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "ADMIN";

  const publicPaths = ["/", "/login", "/register"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {isLoggedIn && !publicPaths.includes(location.pathname) && (
        <div className="w-56 bg-[#002855] text-white p-4">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded" />
            <h1 className="text-lg font-bold">IT Support</h1>
          </div>
          <Sidebar />
        </div>
      )}
      <div className={`flex-1 p-6 ${isLoggedIn ? "ml-56" : ""}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <ServiceRequestForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-requests"
            element={
              <ProtectedRoute adminOnly>
                <AdminRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div className="text-center text-red-500">404 - Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
