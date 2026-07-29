import express from "express";
import {
  claimOpenDelivery,
  deleteDelivery,
  getAllDeliveries,
  getDeliveryById,
  getMyDeliveries,
  getNotifications,
  getOpenDeliveries,
  markNotificationsRead,
  rateDelivery,
  requestDeliveryByNgo,
  verifyOtpAndComplete
} from "../controllers/deliveryController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";

const DeliveryRoutes = express.Router();

// NGO creates open delivery request
DeliveryRoutes.post("/request", verifyToken, checkRole("ngo"), requestDeliveryByNgo);

// Partner views open requests & claims
DeliveryRoutes.get("/open", verifyToken, getOpenDeliveries);
DeliveryRoutes.put("/:id/claim", verifyToken, checkRole("partner"), claimOpenDelivery);

// OTP Verification & completion
DeliveryRoutes.put("/:id/verify-otp", verifyToken, checkRole("partner"), verifyOtpAndComplete);

// Rating & My Deliveries
DeliveryRoutes.get("/my-deliveries", verifyToken, getMyDeliveries);
DeliveryRoutes.get("/notifications", verifyToken, getNotifications);
DeliveryRoutes.put("/notifications/read", verifyToken, markNotificationsRead);

DeliveryRoutes.get("/", getAllDeliveries);
DeliveryRoutes.get("/:id", getDeliveryById);
DeliveryRoutes.put("/:id/rate", verifyToken, rateDelivery);
DeliveryRoutes.delete("/:id", verifyToken, deleteDelivery);

export default DeliveryRoutes;