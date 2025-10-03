// backend/controllers/authController.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'; // Ensure you set a strong secret in .env
export const register = async (req, res) => {
    try {
        // --- DEBUGGING LINE ---
        console.log('--- ACTUAL REQ.BODY CONTENTS ---', req.body);
        // --- END DEBUGGING LINE ---
        const { name, departmentName, headName, phoneNumber, email, password, role } = req.body;
        // Input validation (basic)
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                departmentName,
                headName,
                phoneNumber,
                email,
                password: hashed,
                role: role || 'USER' // Default to 'USER' if role is not provided
            }
        });
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                departmentName: user.departmentName,
                headName: user.headName,
                phoneNumber: user.phoneNumber,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt, // Include these for completeness if needed
                updatedAt: user.updatedAt,
            }
        });
    }
    catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ message: 'Registration failed', error: err instanceof Error ? err.message : String(err) });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials (email not found).' });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(400).json({ message: 'Invalid credentials (password mismatch).' });
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Login failed', error: err instanceof Error ? err.message : String(err) });
    }
};
