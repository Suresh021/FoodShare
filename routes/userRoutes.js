import express from "express";
import {
    deleteUser,
    getAllUsers,
    getTopRatedUsers,
    getUserById,
    getUserProfile,
    getUserStats,
    rateUser,
    searchUsers,
    updateUserProfile
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const UserRoutes = express.Router();
UserRoutes.get("/", getAllUsers);
UserRoutes.get("/top-rated", getTopRatedUsers);
UserRoutes.get("/search", searchUsers);
UserRoutes.get("/profile", verifyToken, getUserProfile);
UserRoutes.put("/profile", verifyToken, updateUserProfile);
UserRoutes.get("/:id", getUserById);
UserRoutes.get("/:id/stats", getUserStats);
UserRoutes.put("/:id/rate", verifyToken, rateUser);
UserRoutes.delete("/:id", verifyToken, deleteUser);

export default UserRoutes;