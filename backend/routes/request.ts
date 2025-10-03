// backend/routes/request.ts

import { Router } from "express";
import {
  createRequestController,
  getMyRequestsController,
  updateRequestController,
  deleteRequestController,
  getUserStatsController, // ✅ NEW: Dashboard stats
} from "../controllers/requestController";

import { addCommentByUserController } from "../controllers/commentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// 🔒 All routes require authentication
router.use(protect);

// 📝 Submit new request
router.post("/", createRequestController);

// 📄 View own requests (with comments)
router.get("/", getMyRequestsController);

// 📊 Request stats for dashboard (user/admin)
router.get("/stats/summary", getUserStatsController); // ✅ NEW

// ✏️ Update own request
router.put("/:id", updateRequestController);

// ❌ Delete own request
router.delete("/:id", deleteRequestController);

// 💬 Add comment to own request
router.post("/:id/comment", addCommentByUserController);

export default router;
