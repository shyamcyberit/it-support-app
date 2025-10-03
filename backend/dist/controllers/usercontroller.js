// backend/controllers/userController.ts
import { PrismaClient, RequestStatus } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate requestId
const prisma = new PrismaClient();
// IMPORTANT NOTE ON REDUNDANCY:
// The functionalities below (creating and fetching requests) are also present and more
// comprehensively handled in `requestController.ts`.
// For better code organization and maintainability, it is recommended to consolidate
// all request-related logic into `requestController.ts` and adjust your API routes
// accordingly. This `userController.ts` would ideally then focus solely on user
// profile management (e.g., getUserProfile, updateProfile, etc.).
// Create a new service request for the logged-in user
export const createServiceRequestController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated. Access denied." });
        }
        const userId = req.user.id;
        // Include category as it's now in your schema
        const { title, description, category } = req.body;
        if (!title || typeof title !== 'string' || title.trim() === '' ||
            !description || typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ message: "Title and description are required and must be non-empty strings." });
        }
        // Category is optional, but if provided, validate it
        if (category !== undefined && typeof category !== 'string') {
            return res.status(400).json({ message: "Category must be a string if provided." });
        }
        const newRequestId = uuidv4().slice(0, 8).toUpperCase();
        const newRequest = await prisma.request.create({
            data: {
                userId: userId,
                requestId: newRequestId,
                title: title.trim(),
                description: description.trim(),
                category: category ? category.trim() : null, // Store category if provided, otherwise null
                status: RequestStatus.PENDING,
                remarks: [], // Initialize as an empty JSON array
            },
        });
        res.status(201).json(newRequest);
    }
    catch (error) {
        console.error("Error in createServiceRequestController:", error);
        res.status(500).json({ message: "Failed to create service request.", error: error.message });
    }
};
// Get all service requests for the logged-in user
export const getMyRequestsController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated. Access denied." });
        }
        const userId = req.user.id;
        const requests = await prisma.request.findMany({
            where: {
                userId: userId,
            },
            include: {
                assignedTo: {
                    select: { name: true, email: true }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(requests);
    }
    catch (error) {
        console.error("Error in getMyRequestsController:", error);
        res.status(500).json({ message: "Failed to fetch user's service requests.", error: error.message });
    }
};
