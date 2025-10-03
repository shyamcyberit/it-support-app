import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EditRequestModal from "../components/EditRequestModal";
import { API_BASE_URL } from "../config";

interface Request {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
  };
}

const MyRequests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);

  useEffect(() => {
    if (user) fetchMyRequests();
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error("❌ Failed to load requests:", err);
    }
  };

  const handleCommentSubmit = async (requestId: string) => {
    const comment = commentText[requestId];
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/requests/${requestId}/comment`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText((prev) => ({ ...prev, [requestId]: "" }));
      fetchMyRequests();
    } catch (err) {
      console.error("❌ Failed to post comment:", err);
    }
  };

  const handleDelete = async (requestId: string) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyRequests();
    } catch (err) {
      console.error("❌ Failed to delete request:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-blue-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-blue-900">My IT Support Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-blue-100"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-800">{req.title}</h3>
              <div className="space-x-2">
                <button
                  onClick={() => setEditingRequest(req)}
                  className="text-sm bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(req.id)}
                  className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-gray-700 mt-1">{req.description}</p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Status:</strong>{" "}
              <span className="capitalize text-blue-700 font-semibold">{req.status}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Submitted on: {new Date(req.createdAt).toLocaleString()}
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Comments</h4>
              {req.comments.length > 0 ? (
                req.comments.map((cmt) => (
                  <div key={cmt.id} className="text-sm text-gray-700 mb-1">
                    <strong>{cmt.user.name}:</strong> {cmt.text}{" "}
                    <span className="text-xs text-gray-400">
                      ({new Date(cmt.createdAt).toLocaleString()})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No comments yet.</p>
              )}
            </div>

            <div className="mt-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder="Write a comment..."
                value={commentText[req.id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({ ...prev, [req.id]: e.target.value }))
                }
              />
              <button
                onClick={() => handleCommentSubmit(req.id)}
                className="mt-2 bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-800 text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        ))
      )}

      {/* Modal */}
      {editingRequest && (
        <EditRequestModal
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
          onUpdated={fetchMyRequests}
        />
      )}
    </div>
  );
};

export default MyRequests;
