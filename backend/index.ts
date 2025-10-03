import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Route imports
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import requestRoutes from "./routes/request";
import adminRoutes from "./routes/admin";

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "*" })); // ✅ Allow CORS from any origin for LAN access
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (_req, res) => {
  res.send("✅ IT Support Management API is running.");
});

// ✅ Server listener (bind to 0.0.0.0 for LAN access)
const PORT = process.env.PORT || 5001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://<your-ip>:${PORT}`);
});
