import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";
import { createRequest, getUserRequests, updateRequestByUser, deleteRequestByUser, addUserRemark, getAllRequests, updateRequestByAdmin, deleteRequestByAdmin, } from "../controllers/requestController";
const router = express.Router();
// USER routes
router.post("/", authMiddleware, createRequest);
router.get("/", authMiddleware, getUserRequests);
router.put("/:id", authMiddleware, updateRequestByUser);
router.delete("/:id", authMiddleware, deleteRequestByUser);
router.post("/:id/remark", authMiddleware, addUserRemark);
// ADMIN routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllRequests);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateRequestByAdmin);
router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteRequestByAdmin);
export default router;
