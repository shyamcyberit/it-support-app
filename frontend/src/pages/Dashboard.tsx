// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/TopBar";
import { API_BASE_URL } from "../config"; // ✅ Import API base URL from .env

interface Stats {
  total: number;
  pending: number;
  under_process: number;
  examined: number;
  under_observation: number;
  completed: number;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/requests/stats/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-100">
      <TopBar />

      <main className="p-10">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">
            Welcome, {user?.name}!
          </h2>
          <p className="text-gray-600 text-lg">
            You are logged in as{" "}
            <span className="font-semibold capitalize text-blue-700">
              {user?.role}
            </span>.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-500 col-span-3">Loading report...</p>
            ) : error || !stats ? (
              <p className="text-red-500 col-span-3">⚠️ Failed to load statistics.</p>
            ) : (
              <>
                <StatCard label="Total Requests" count={stats.total} color="bg-blue-500" />
                <StatCard label="Pending" count={stats.pending} color="bg-yellow-500" />
                <StatCard label="Under Process" count={stats.under_process} color="bg-orange-500" />
                <StatCard label="Examined" count={stats.examined} color="bg-purple-500" />
                <StatCard label="Under Observation" count={stats.under_observation} color="bg-teal-500" />
                <StatCard label="Completed" count={stats.completed} color="bg-green-600" />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div className={`p-6 rounded-xl shadow text-white ${color}`}>
    <h3 className="text-lg font-semibold mb-1">{label}</h3>
    <p className="text-4xl font-bold">{count}</p>
  </div>
);

export default Dashboard;
