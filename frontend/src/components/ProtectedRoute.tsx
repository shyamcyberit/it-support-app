// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6 text-center">Checking user...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return <>{children}</>;
};

export default ProtectedRoute;
