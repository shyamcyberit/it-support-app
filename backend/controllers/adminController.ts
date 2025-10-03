// backend/controllers/adminController.ts

import { Request, Response } from "express";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Admin: View all requests with full user info and comments
export const adminRequestsController = async (_req: Request, res: Response) => {
  try {
    const requests = await prisma.request.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            departmentName: true,
            headName: true, // ✅ Added
          },
        },
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

    res.json(requests);
  } catch (error) {
    console.error("❌ Failed to fetch admin requests:", error);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

// ✅ Admin: Update request status
export const updateRequestStatusController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses: Status[] = [
    "pending",
    "under_process",
    "examined",
    "under_observation",
    "completed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status: status as Status,
      },
    });

    res.json({ message: "Status updated", request: updatedRequest });
  } catch (error) {
    console.error("❌ Failed to update request status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// ✅ Admin: Add comment to any request
export const addCommentByAdminController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        text,
        requestId: id,
        userId: req.user?.id!, // Admin's ID from token
      },
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("❌ Failed to add comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// ✅ Admin: Delete any request
export const deleteRequestByAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.request.delete({
      where: { id },
    });

    res.json({ message: "Request deleted by admin" });
  } catch (error) {
    console.error("❌ Failed to delete request:", error);
    res.status(500).json({ error: "Failed to delete request" });
  }
};
