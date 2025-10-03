// src/pages/ServiceRequestForm.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ServiceRequestForm: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit request");
      }

      setSuccess("Request submitted successfully.");
      setTitle("");
      setDescription("");

      setTimeout(() => navigate("/my-requests"), 1200);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-gray-50 to-blue-50 shadow-xl rounded-xl animate-fade-in">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Submit New IT Support Request</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-blue-900">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Printer not working in Room 203"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-blue-900">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={6}
            className="w-full p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the issue in detail..."
          />
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition font-medium"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
