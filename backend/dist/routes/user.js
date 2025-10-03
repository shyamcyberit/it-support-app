import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { createServiceRequestController, getMyRequestsController, } from "../controllers/userController";
const router = express.Router();
// User endpoints (require authentication)
router.post("/service-request", authenticate, createServiceRequestController);
router.get("/my-requests", authenticate, getMyRequestsController);
export default router;
