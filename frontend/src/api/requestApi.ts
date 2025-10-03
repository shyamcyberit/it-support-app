// frontend/src/api/requestApi.ts

import api from "./axios";

// ✅ Create a request
export const createRequest = (data: { title: string; description: string }) =>
  api.post("/requests", data);

// ✅ Get user’s own requests
export const getUserRequests = async () => {
  const res = await api.get("/requests/my");
  return res.data.requests;
};

// ✅ Admin: Get all requests
export const getAllRequests = async () => {
  const res = await api.get("/admin/requests");
  return res.data.requests;
};

// ✅ Admin: Update a request
export const updateRequest = (id: string, data: { status?: string }) =>
  api.put(`/admin/requests/${id}`, data);
