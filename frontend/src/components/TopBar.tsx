// src/components/ui/TopBar.tsx

import React from "react";
import { useAuth } from "../context/AuthContext";

const TopBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      {/* App Title */}
      <h1 className="text-xl font-bold text-blue-900">IT Support Dashboard</h1>

      {/* User Info */}
      <div className="text-sm text-gray-700">
        Logged in as:{" "}
        <span className="font-semibold capitalize text-blue-800">
          {user?.name} ({user?.role})
        </span>
      </div>
    </header>
  );
};

export default TopBar;
