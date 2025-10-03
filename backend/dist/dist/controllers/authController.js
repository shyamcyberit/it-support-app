// backend/controllers/authController.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client'; // Import UserRole enum
const prisma = new PrismaClient();
// Ensure JWT_SECRET is loaded from environment variables in production.
// Provide a strong default for development if .env is not yet set.
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key'; // CHANGE THIS IN PRODUCTION!
// --- Register New User ---
export const register = async (req, res) => {
    try {
        // Destructure fields from the request body.
        // We explicitly omit 'role' here, as public registration should always default to USER role.
        const { name, departmentName, headName, phoneNumber, email, password } = req.body;
        // Basic validation for required fields
        if (!name || !departmentName || !headName || !phoneNumber || !email || !password) {
            return res.status(400).json({ message: 'All required fields (name, departmentName, headName, phoneNumber, email, password) must be provided.' });
        }
        // Check if a user with the given email already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                departmentName,
                headName,
                phoneNumber,
                email,
                password: hashedPassword,
                role: UserRole.USER, // Assign the default USER role from the enum
            },
        });
        // Generate a JSON Web Token for the newly registered user
        const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' } // Token expires in 1 day
        );
        // Respond with the token and essential user details
        res.status(201).json({
            message: 'Registration successful!',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                departmentName: newUser.departmentName,
                headName: newUser.headName,
                phoneNumber: newUser.phoneNumber,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (err) { // Catch any errors during the registration process
        console.error('Registration error:', err); // Log the detailed error for debugging
        res.status(500).json({ message: 'Registration failed.', error: err.message }); // Send a user-friendly error message
    }
};
// --- User Login ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Basic validation for required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        // Find the user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Compare the provided password with the hashed password in the database
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // Generate a JSON Web Token for the logged-in user
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' } // Token expires in 1 day
        );
        // Respond with the token and essential user details
        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) { // Catch any errors during the login process
        console.error('Login error:', err); // Log the detailed error for debugging
        res.status(500).json({ message: 'Login failed.', error: err.message }); // Send a user-friendly error message
    }
};
