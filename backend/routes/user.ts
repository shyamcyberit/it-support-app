// backend/routes/user.ts

import { Router } from "express";
import {
  getCurrentUserController,
  updateUserProfileController,
  getAllUsersController,
  updateUserController,
  deleteUserController,
  createUserByAdminController,
} from "../controllers/userController";

import { protect, authorize } from "../middleware/authMiddleware";

const router = Router();

// ✅ Logged-in user routes
router.get("/me", protect, getCurrentUserController);
router.put("/me", protect, updateUserProfileController);

// ✅ Admin: create new user (Full Name, Email, Phone, Department, Head, Password)
router.post("/admin/users", protect, authorize, createUserByAdminController);

// ✅ Admin: list/update/delete users
router.get("/", protect, authorize, getAllUsersController);
router.put("/:id", protect, authorize, updateUserController);
router.delete("/:id", protect, authorize, deleteUserController);

export default router;
