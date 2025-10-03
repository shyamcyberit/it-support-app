// backend/controllers/requestController.ts
import { PrismaClient, RequestStatus, Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid"; // Import uuid to generate requestId
const prisma = new PrismaClient();
// --- User-specific Request Operations ---
// User creates a new request
export const createRequest = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const { title, description, category } = req.body; // Include category from request body
        // Basic input validation
        if (!title || typeof title !== 'string' || title.trim() === '' ||
            !description || typeof description !== 'string' || description.trim() === '') {
            return res.status(400).json({ message: "Title and description are required and must be non-empty strings." });
        }
        // Category is optional, but if provided, validate it
        if (category !== undefined && typeof category !== 'string') {
            return res.status(400).json({ message: "Category must be a string if provided." });
        }
        // Generate a unique, short requestId (e.g., for user-friendly reference)
        const newRequestId = uuidv4().slice(0, 8).toUpperCase();
        const newRequest = await prisma.request.create({
            data: {
                userId: req.user.id,
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
    catch (err) {
        console.error("Failed to create request:", err);
        res.status(500).json({ message: "Failed to create request.", error: err.message });
    }
};
// User gets their own requests
export const getUserRequests = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const requests = await prisma.request.findMany({
            where: {
                userId: req.user.id,
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
    catch (err) {
        console.error("Failed to fetch user requests:", err);
        res.status(500).json({ message: "Failed to fetch requests.", error: err.message });
    }
};
// User updates their own request (allowed only if not 'COMPLETED')
export const updateRequestByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const existingRequest = await prisma.request.findFirst({
            where: {
                id: requestId,
                userId: req.user.id,
                status: {
                    not: RequestStatus.COMPLETED,
                },
            },
        });
        if (!existingRequest) {
            return res.status(404).json({ message: "Request not found or cannot be updated (e.g., already completed or not owned by user)." });
        }
        // Users can only update title, description, and category
        const updateData = {};
        if (req.body.title !== undefined && typeof req.body.title === 'string') {
            updateData.title = req.body.title.trim();
        }
        if (req.body.description !== undefined && typeof req.body.description === 'string') {
            updateData.description = req.body.description.trim();
        }
        if (req.body.category !== undefined) { // Category can be updated to null (remove it) or a string
            if (typeof req.body.category === 'string') {
                updateData.category = req.body.category.trim();
            }
            else if (req.body.category === null) {
                updateData.category = null;
            }
            else {
                return res.status(400).json({ message: "Category must be a string or null if provided." });
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update (only title, description, category can be updated)." });
        }
        const updatedRequest = await prisma.request.update({
            where: { id: requestId },
            data: updateData,
        });
        res.json(updatedRequest);
    }
    catch (err) {
        console.error("Failed to update request by user:", err);
        res.status(500).json({ message: "Failed to update request.", error: err.message });
    }
};
// User deletes their own request (allowed only if not 'COMPLETED')
export const deleteRequestByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const deletedResult = await prisma.request.deleteMany({
            where: {
                id: requestId,
                userId: req.user.id,
                status: {
                    not: RequestStatus.COMPLETED,
                },
            },
        });
        if (deletedResult.count === 0) {
            return res.status(404).json({ message: "Request not found or cannot be deleted (e.g., already completed or not owned by user)." });
        }
        res.json({ message: "Request deleted successfully." });
    }
    catch (err) {
        console.error("Failed to delete request by user:", err);
        res.status(500).json({ message: "Failed to delete request.", error: err.message });
    }
};
// User adds a remark/feedback to their own request
export const addUserRemark = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const remarkText = req.body.text;
        if (!remarkText || typeof remarkText !== 'string' || remarkText.trim() === '') {
            return res.status(400).json({ message: "Remark text is required and must be a non-empty string." });
        }
        const existingRequest = await prisma.request.findFirst({
            where: {
                id: requestId,
                userId: req.user.id,
            },
            select: { remarks: true }
        });
        if (!existingRequest) {
            return res.status(404).json({ message: "Request not found or not owned by user." });
        }
        // Ensure remarks is treated as an array of the Remark type for manipulation
        // The `remarks` field in Prisma is Json?, which can be null. We default to an empty array.
        const currentRemarks = (existingRequest.remarks || []);
        const newRemark = {
            by: "user",
            text: remarkText.trim(),
            date: new Date().toISOString(), // Convert Date to ISO string for JSON storage
        };
        const updatedRemarks = [...currentRemarks, newRemark];
        const result = await prisma.request.update({
            where: { id: requestId },
            data: {
                remarks: updatedRemarks, // Cast to Prisma.JsonArray
            },
        });
        res.json(result);
    }
    catch (err) {
        console.error("Failed to add user remark:", err);
        res.status(500).json({ message: "Failed to add remark.", error: err.message });
    }
};
// --- Admin-specific Request Operations ---
// IMPORTANT: These routes MUST be protected by an authorization middleware (e.g., authorize(UserRole.ADMIN))
// on your router definition (e.g., in `backend/routes/request.ts` or `admin.ts`).
// ADMIN: Get all requests (across all users)
export const getAllRequests = async (_req, res) => {
    try {
        const requests = await prisma.request.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        departmentName: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.json(requests);
    }
    catch (err) {
        console.error("Failed to fetch all requests (admin):", err);
        res.status(500).json({ message: "Failed to fetch all requests.", error: err.message });
    }
};
// ADMIN: Update request status and/or add admin remarks and/or assign to another user
export const updateRequestByAdmin = async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            select: { status: true, remarks: true }
        });
        if (!existingRequest) {
            return res.status(404).json({ message: "Request not found." });
        }
        const { status, remark, assignedToId } = req.body;
        const updateData = {};
        if (status !== undefined && typeof status === 'string') {
            const newStatus = status.toUpperCase();
            // ===> THIS IS THE ONLY LINE THAT NEEDS TO CHANGE <===
            if (Object.values(RequestStatus).includes(newStatus)) { // Add 'as RequestStatus' here
                updateData.status = newStatus;
            }
            else {
                return res.status(400).json({ message: `Invalid status: "${status}". Valid statuses are: ${Object.values(RequestStatus).join(', ')}` });
            }
        }
        if (remark !== undefined && typeof remark === 'string' && remark.trim() !== '') {
            const newRemark = {
                by: "admin",
                text: remark.trim(),
                date: new Date().toISOString(), // Convert Date to ISO string
            };
            const currentRemarks = (existingRequest.remarks || []);
            updateData.remarks = [...currentRemarks, newRemark];
        }
        if (assignedToId !== undefined) {
            if (typeof assignedToId === 'number' || assignedToId === null) {
                if (assignedToId !== null) {
                    // Optional: Verify if the assignedToId exists as a valid user
                    const assignedUser = await prisma.user.findUnique({ where: { id: assignedToId } });
                    if (!assignedUser) {
                        return res.status(400).json({ message: "Assigned user ID does not exist." });
                    }
                }
                updateData.assignedToId = assignedToId;
            }
            else {
                return res.status(400).json({ message: "assignedToId must be a number or null." });
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid status, remark, or assignedToId provided for update." });
        }
        const updatedRequest = await prisma.request.update({
            where: { id: requestId },
            data: updateData,
        });
        res.json(updatedRequest);
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: "Request not found." });
        }
        console.error("Failed to update request by admin:", err);
        res.status(500).json({ message: "Failed to update request.", error: err.message });
    }
};
// ADMIN: Delete any request
export const deleteRequestByAdmin = async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const deletedRequest = await prisma.request.delete({
            where: { id: requestId },
        });
        res.json({ message: "Request deleted successfully.", deletedRequest });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ message: "Request not found." });
        }
        console.error("Failed to delete request by admin:", err);
        res.status(500).json({ message: "Failed to delete request.", error: err.message });
    }
};
