import api from "./api";

export const getAllUsers = () =>
  api.get("/admin/users");

export const updateUser = (id: string, data: { role?: string; isActive?: boolean }) =>
  api.patch(`/admin/users/${id}`, data);
