import { Router } from "express";
import { UserRole } from "@prisma/client";
import { authorize } from "../middleware/authMiddleware";
import { adminRequestsController, updateRequestController, getAllUsersController, updateUserController, deleteRequestByAdmin } from "../controllers/adminController";
const router = Router();
// Protect admin routes with authorization
router.get("/requests", authorize(UserRole.ADMIN), adminRequestsController);
router.patch("/requests/:id", authorize(UserRole.ADMIN), updateRequestController);
router.delete("/requests/:id", authorize(UserRole.ADMIN), deleteRequestByAdmin // Added missing authorization
);
router.get("/users", authorize(UserRole.ADMIN), getAllUsersController);
router.patch("/users/:id", authorize(UserRole.ADMIN), updateUserController);
export default router;
