// backend/middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { PrismaClient, UserRole } from '@prisma/client'; // Import PrismaClient and UserRole enum
// Initialize PrismaClient if you need to fetch user details beyond what's in the token.
// For basic auth/auth, using only token payload is more performant.
const prisma = new PrismaClient(); // Keep this if you might use it later, otherwise remove if not needed.
// Ensure this matches the JWT_SECRET used in authController.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key'; // Make sure this is the same secret!
// --- Authentication Middleware ---
// This middleware verifies the JWT token and attaches user info (from the token) to the request.
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    // 1. Check if Authorization header is present and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No authentication token provided. Access denied." });
    }
    // 2. Extract the token
    const token = authHeader.split(" ")[1];
    try {
        // 3. Verify the token using the secret.
        // The payload we signed in authController.ts contains userId and role.
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // 4. Attach the user information from the *token payload* to the request object.
        // We are deliberately NOT hitting the database here for performance reasons.
        // The token itself is the source of truth for this request's authentication.
        req.user = {
            id: decodedToken.userId,
            role: decodedToken.role,
        };
        // 5. Proceed to the next middleware or route handler
        next();
    }
    catch (err) {
        // 6. Handle token verification errors (e.g., token expired, invalid signature, malformed token)
        console.error('Authentication failed (Invalid or expired token):', err.message);
        return res.status(401).json({ message: "Authentication failed: Invalid or expired token." });
    }
};
// --- Authorization Middleware ---
// This middleware checks if the authenticated user has the required role.
export const authorize = (requiredRole) => {
    return (req, res, next) => {
        // Ensure the `authenticate` middleware ran before this one,
        // so `req.user` is populated.
        const user = req.user;
        // If `req.user` is somehow not set (meaning authenticate didn't run or failed),
        // this request is unauthorized.
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User information missing from request context. (Auth middleware might be missing or failed)." });
        }
        // Check if the authenticated user's role matches the required role
        if (user.role !== requiredRole) {
            return res.status(403).json({ message: `Forbidden: Access restricted to ${requiredRole} users.` });
        }
        // If the user has the required role, proceed to the next middleware or route handler
        next();
    };
};
// Optional aliases for clarity or if you prefer shorter names in route definitions
export const authMiddleware = authenticate;
export const adminMiddleware = authorize(UserRole.ADMIN); // Use UserRole.ADMIN from the enum
