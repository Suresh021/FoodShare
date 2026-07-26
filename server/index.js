import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import dbConnect from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "FoodShare API is healthy",
        uptime: process.uptime(),
        timestamp: new Date(),
        port: process.env.PORT || 8080,
        mongodb: "Connected"
    });
});

// Welcome
app.get("/", (req, res) => {
    res.json({ message: "Welcome to FoodShare API" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/deliveries", deliveryRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Error Handler (MUST be last)
app.use(errorHandler);

// Connect to database for serverless environment
dbConnect().then(() => {
    console.log("✅ Database connected");
}).catch(err => {
    console.error("Database connection failed:", err.message);
});

// Only start the server locally (Vercel handles this automatically)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Health: http://localhost:${PORT}/health`);
    });
}

export default app;
export default app; 
