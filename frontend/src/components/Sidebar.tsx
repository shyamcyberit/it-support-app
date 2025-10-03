// src/components/Sidebar.tsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col gap-4 text-sm">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `block px-3 py-2 rounded hover:bg-blue-800 ${
            isActive ? "bg-blue-800 font-semibold" : ""
          }`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/submit"
        className={({ isActive }) =>
          `block px-3 py-2 rounded hover:bg-blue-800 ${
            isActive ? "bg-blue-800 font-semibold" : ""
          }`
        }
      >
        Submit Request
      </NavLink>

      <NavLink
        to="/my-requests"
        className={({ isActive }) =>
          `block px-3 py-2 rounded hover:bg-blue-800 ${
            isActive ? "bg-blue-800 font-semibold" : ""
          }`
        }
      >
        My Requests
      </NavLink>

      {user?.role === "ADMIN" && (
        <NavLink
          to="/admin-requests"
          className={({ isActive }) =>
            `block px-3 py-2 rounded hover:bg-blue-800 ${
              isActive ? "bg-blue-800 font-semibold" : ""
            }`
          }
        >
          All Requests
        </NavLink>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-left"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
