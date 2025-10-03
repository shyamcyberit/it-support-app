// backend/controllers/userController.ts

import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ✅ GET /api/users/me
export const getCurrentUserController = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        departmentName: true,
        headName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
};

// ✅ PUT /api/users/me
export const updateUserProfileController = async (req: Request, res: Response) => {
  const { name, departmentName, headName, phoneNumber, password } = req.body;

  try {
    const updates: any = {};

    if (name) updates.name = name;
    if (departmentName) updates.departmentName = departmentName;
    if (headName) updates.headName = headName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        departmentName: true,
        headName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update user profile." });
  }
};

// ✅ GET /api/admin/users
export const getAllUsersController = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        departmentName: true,
        headName: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// ✅ PUT /api/admin/users/:id
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role as Role },
    });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: "Failed to update user." });
  }
};

// ✅ DELETE /api/admin/users/:id
export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

// ✅ POST /api/admin/users
export const createUserByAdminController = async (req: Request, res: Response) => {
  const { name, email, password, phoneNumber, departmentName, headName, role } = req.body;

  if (!name || !email || !password || !phoneNumber || !departmentName || !headName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        departmentName,
        headName,
        role: role === "ADMIN" ? "ADMIN" : "USER",
      },
    });

    res.status(201).json({ message: "User created", userId: newUser.id });
  } catch (err) {
    console.error("Admin create user error:", err);
    console.log("Request Body:", req.body); // 💡 Log data that caused failure
    res.status(500).json({ message: "Failed to create user." });
  }
};
