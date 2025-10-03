// backend/controllers/commentController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Add comment to user's own request
export const addCommentByUserController = async (req: Request, res: Response) => {
  const { id } = req.params; // request ID
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required" });
  }

  try {
    // Confirm that the request belongs to the logged-in user
    const targetRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!targetRequest || targetRequest.userId !== req.user?.id) {
      return res.status(403).json({ error: "Unauthorized or request not found" });
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        requestId: id,
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};
