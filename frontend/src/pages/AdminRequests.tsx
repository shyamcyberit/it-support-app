// src/pages/AdminRequests.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const AdminRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Under Process", value: "under_process" },
    { label: "Examined", value: "examined" },
    { label: "Under Observation", value: "under_observation" },
    { label: "Completed", value: "completed" },
  ];

  useEffect(() => {
    if (user) fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch admin requests", err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/admin/requests/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (err) {
      console.error("❌ Failed to update status", err);
    }
  };

  const postComment = async () => {
    if (!selectedRequestId || !comment.trim()) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/admin/requests/${selectedRequestId}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setSelectedRequestId(null);
      fetchRequests();
    } catch (err) {
      console.error("❌ Failed to post admin comment", err);
    }
  };

  const deleteRequest = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this request?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/admin/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error("❌ Failed to delete request", err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">Admin: All Service Requests</h2>

      {requests.map((req) => (
        <div key={req.id} className="bg-white rounded-2xl p-5 shadow-lg mb-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-900 mb-1">{req.title}</h3>
          <p className="text-gray-700 mb-1">{req.description}</p>

          <div className="text-sm text-gray-700 mb-3 bg-blue-50 rounded-lg p-3">
            <p>
              <span className="font-medium">Submitted by:</span>{" "}
              {req.user?.name || "Unknown"} ({req.user?.email || "N/A"})
            </p>
            <p>
              <span className="font-medium">Phone:</span>{" "}
              {req.user?.phoneNumber || "N/A"}
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {req.user?.departmentName || "N/A"}
            </p>
            <p>
              <span className="font-medium">Head of Department:</span>{" "}
              {req.user?.headName || "N/A"}
            </p>
          </div>

          <p className="text-sm mb-2">
            <span className="font-medium text-gray-700">Current Status:</span>{" "}
            <span className="font-semibold text-blue-700">{req.status.replace(/_/g, " ")}</span>
          </p>

          <div className="mt-2">
            <label className="mr-2 font-medium">Update Status:</label>
            <select
              value={req.status}
              onChange={(e) => updateStatus(req.id, e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="">Select status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-sm mb-1 text-blue-700">Comments:</h4>
            <ul className="text-sm list-disc ml-5 text-gray-700">
              {req.comments?.map((c: any) => (
                <li key={c.id}>
                  <strong>{c.user?.name}:</strong> {c.text}
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <textarea
                className="border w-full rounded p-2 text-sm"
                placeholder="Add a comment..."
                value={selectedRequestId === req.id ? comment : ""}
                onChange={(e) => {
                  setSelectedRequestId(req.id);
                  setComment(e.target.value);
                }}
              />
              <button
                onClick={postComment}
                className="mt-2 bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() => deleteRequest(req.id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Delete Request
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRequests;
