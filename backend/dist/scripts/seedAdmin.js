import mongoose from "mongoose";
import User from "../models/User";
import bcrypt from "bcryptjs";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb"; // Set your DB name
async function seedAdmin() {
    await mongoose.connect(MONGO_URI);
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await User.create({
            name: "IT Admin",
            email: "admin@iitrcampus.com",
            password: hashedPassword,
            department: "IT",
            role: "admin",
        });
        console.log("Admin user created!");
    }
    else {
        console.log("Admin already exists.");
    }
    mongoose.disconnect();
}
seedAdmin();
