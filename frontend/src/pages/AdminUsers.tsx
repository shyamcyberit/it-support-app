// src/pages/AdminUsers.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  departmentName?: string;
  headName?: string;
  role: "USER" | "ADMIN";
}

const AdminUsers: React.FC = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: "USER" | "ADMIN") => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/users/${id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user role:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      alert("You cannot delete yourself.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-800 py-10 px-6 text-gray-900">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">User Management</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Department</th>
                  <th className="border px-4 py-2">Head</th>
                  <th className="border px-4 py-2">Role</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{u.name}</td>
                    <td className="border px-4 py-2">{u.email}</td>
                    <td className="border px-4 py-2">{u.phoneNumber || "-"}</td>
                    <td className="border px-4 py-2">{u.departmentName || "-"}</td>
                    <td className="border px-4 py-2">{u.headName || "-"}</td>
                    <td className="border px-4 py-2 capitalize">{u.role}</td>
                    <td className="border px-4 py-2">
                      {u.id !== user?.id ? (
                        <div className="flex gap-2">
                          {u.role === "USER" ? (
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                              onClick={() => handleRoleChange(u.id, "ADMIN")}
                            >
                              Make Admin
                            </button>
                          ) : (
                            <button
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                              onClick={() => handleRoleChange(u.id, "USER")}
                            >
                              Revoke Admin
                            </button>
                          )}
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs italic text-gray-500">Current Admin</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
