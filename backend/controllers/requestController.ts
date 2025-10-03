// backend/controllers/requestController.ts

import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();

// ✅ Create new request (ignores extra user-provided metadata)
export const createRequestController = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, phoneNumber, departmentName, headName } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    // ⚠️ We don't store phone/department/head info — just log for debugging or ignore
    console.log("📩 Metadata:", { phoneNumber, departmentName, headName });

    const newRequest = await prisma.request.create({
      data: {
        title,
        description,
        userId: req.user!.id,
        status: "pending",
      },
    });

    res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (error) {
    console.error("❌ Error creating request:", error);
    res.status(500).json({ error: "Failed to create request" });
  }
};

// ✅ Get current user's own requests
export const getMyRequestsController = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await prisma.request.findMany({
      where: { userId: req.user!.id },
      include: {
        comments: {
          include: {
            user: {
              select: { name: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("❌ Error fetching user requests:", error);
    res.status(500).json({ error: "Failed to fetch your requests" });
  }
};

// ✅ Update own request
export const updateRequestController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const existing = await prisma.request.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized or request not found" });
    }

    const updated = await prisma.request.update({
      where: { id },
      data: { title, description },
    });

    res.json({ message: "Request updated", request: updated });
  } catch (error) {
    console.error("❌ Error updating request:", error);
    res.status(500).json({ error: "Failed to update request" });
  }
};

// ✅ Delete own request
export const deleteRequestController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const existing = await prisma.request.findUnique({ where: { id } });

    if (!existing || existing.userId !== req.user!.id) {
      return res.status(403).json({ error: "Unauthorized or request not found" });
    }

    await prisma.request.delete({ where: { id } });

    res.json({ message: "Request deleted" });
  } catch (error) {
    console.error("❌ Error deleting request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
};

// ✅ Dashboard Stats (for user/admin)
export const getUserStatsController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const isAdmin = req.user!.role === "ADMIN";

    const where = isAdmin ? {} : { userId };

    const [total, pending, under_process, examined, under_observation, completed] = await Promise.all([
      prisma.request.count({ where }),
      prisma.request.count({ where: { ...where, status: "pending" } }),
      prisma.request.count({ where: { ...where, status: "under_process" } }),
      prisma.request.count({ where: { ...where, status: "examined" } }),
      prisma.request.count({ where: { ...where, status: "under_observation" } }),
      prisma.request.count({ where: { ...where, status: "completed" } }),
    ]);

    return res.status(200).json({
      total,
      pending,
      under_process,
      examined,
      under_observation,
      completed,
    });
  } catch (error: any) {
    console.error("🚨 Dashboard stats error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to load dashboard stats." });
  }
};
