// src/services/auth.ts
import axios from "../api/axios";

export interface User {
  id: number;
  name: string;
  departmentName: string;
  headName: string;
  phoneNumber: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authManager = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await axios.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (
    userData: Omit<User, "id" | "role"> & { password: string }
  ): Promise<AuthResponse> => {
    const res = await axios.post("/auth/register", userData);
    return res.data;
  },
};
