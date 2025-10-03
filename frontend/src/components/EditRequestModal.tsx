// frontend/src/components/EditRequestModal.tsx

import React, { useState } from "react";
import axios from "axios";

interface Props {
  request: {
    id: string;
    title: string;
    description: string;
  };
  onClose: () => void;
  onUpdated: () => void;
}

const EditRequestModal: React.FC<Props> = ({ request, onClose, onUpdated }) => {
  const [title, setTitle] = useState(request.title);
  const [description, setDescription] = useState(request.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/requests/${request.id}`,
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Failed to update request:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Edit Request</h3>
        <input
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRequestModal;
