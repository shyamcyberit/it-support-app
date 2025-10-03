// backend/controllers/adminController.ts
import { PrismaClient, RequestStatus, UserRole, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
// --- Admin Operations on Requests ---
// Get all service requests (admin only)
export const adminRequestsController = async (req, res) => {
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
    catch (error) {
        console.error("Error fetching all requests (admin):", error);
        res.status(500).json({ message: "Failed to fetch all requests.", error: error.message });
    }
};
// Update a service request status, remarks, and assignment (admin only)
export const updateRequestController = async (req, res) => {
    try {
        const requestId = parseInt(req.params.id);
        if (isNaN(requestId)) {
            return res.status(400).json({ message: "Invalid Request ID provided. Must be a number." });
        }
        const existingRequest = await prisma.request.findUnique({
            where: { id: requestId },
            select: { status: true, remarks: true } // Need current remarks and status
        });
        if (!existingRequest) {
            return res.status(404).json({ message: "Request not found." });
        }
        const { status, remark, assignedToId } = req.body;
        const updateData = {};
        if (status !== undefined && typeof status === 'string') {
            const newStatus = status.toUpperCase();
            if (Object.values(RequestStatus).includes(newStatus)) {
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
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: "Request not found." });
        }
        console.error("Error updating request (admin):", error);
        res.status(500).json({ message: "Failed to update request.", error: error.message });
    }
};
// --- Admin Operations on Users ---
// Get all users (admin only)
export const getAllUsersController = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                departmentName: true,
                headName: true,
                phoneNumber: true,
                createdAt: true,
                updatedAt: true, // <-- This line is now uncommented/added back
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error("Error fetching all users (admin):", error);
        res.status(500).json({ message: "Failed to fetch users.", error: error.message });
    }
};
// Update a user's role or info (admin only)
export const updateUserController = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ message: "Invalid User ID provided. Must be a number." });
        }
        // Explicitly pick allowed fields for update
        const { name, email, role, departmentName, headName, phoneNumber } = req.body;
        const updateData = {};
        if (name !== undefined && typeof name === 'string' && name.trim() !== '') {
            updateData.name = name.trim();
        }
        if (email !== undefined && typeof email === 'string' && email.trim() !== '') {
            updateData.email = email.trim();
        }
        if (departmentName !== undefined && typeof departmentName === 'string' && departmentName.trim() !== '') {
            updateData.departmentName = departmentName.trim();
        }
        if (headName !== undefined && typeof headName === 'string' && headName.trim() !== '') {
            updateData.headName = headName.trim();
        }
        if (phoneNumber !== undefined && typeof phoneNumber === 'string' && phoneNumber.trim() !== '') {
            updateData.phoneNumber = phoneNumber.trim();
        }
        // Validate and set role if provided
        if (role !== undefined && typeof role === 'string') {
            const newRole = role.toUpperCase();
            if (Object.values(UserRole).includes(newRole)) {
                updateData.role = newRole;
            }
            else {
                return res.status(400).json({ message: `Invalid role: "${role}". Valid roles are: ${Object.values(UserRole).join(', ')}` });
            }
        }
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for user update (name, email, role, departmentName, headName, phoneNumber)." });
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return res.status(404).json({ message: "User not found." });
        }
        console.error("Error updating user (admin):", error);
        res.status(500).json({ message: "Failed to update user.", error: error.message });
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
