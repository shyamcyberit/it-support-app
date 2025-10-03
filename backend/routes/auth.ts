// backend/routes/auth.ts

import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controllers/authController";
import { getCurrentUserController } from "../controllers/userController"; // ✅ NEW
import { authorize } from "../middleware/authMiddleware"; // ✅ NEW

const router = Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController); // (optional - token is removed on client side)

// ✅ Authenticated route to get current logged-in user
router.get("/me", authorize, getCurrentUserController);

export default router;
