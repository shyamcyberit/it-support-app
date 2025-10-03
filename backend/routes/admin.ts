// backend/routes/admin.ts

import { Router } from "express";
import {
  adminRequestsController,
  updateRequestStatusController,
  addCommentByAdminController,
  deleteRequestByAdmin,
} from "../controllers/adminController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

// ✅ All admin routes require authentication and admin role
router.use(protect);
router.use(authorize);

// View all service/complaint requests (with user info & comments)
router.get("/requests", adminRequestsController);

// Update status of a request
router.put("/requests/:id/status", updateRequestStatusController);

// Add comment on a request
router.post("/requests/:id/comment", addCommentByAdminController);

// Delete any request
router.delete("/requests/:id", deleteRequestByAdmin);

export default router;
