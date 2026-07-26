import express from "express";
import {
    completeDelivery,
    createDelivery,
    deleteDelivery,
    getAllDeliveries,
    getDeliveriesByStatus,
    getDeliveryById,
    getMyDeliveries,
    getNgoDeliveries,
    getPartnerDeliveries,
    rateDelivery,
    updateDeliveryStatus
} from "../controllers/deliveryController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";

const DeliveryRoutes = express.Router();
DeliveryRoutes.post("/", verifyToken, checkRole("partner"), createDelivery);
DeliveryRoutes.get("/", getAllDeliveries);
DeliveryRoutes.get("/my-deliveries", verifyToken, checkRole("partner", "ngo"), getMyDeliveries);
DeliveryRoutes.get("/status/:status", getDeliveriesByStatus);
DeliveryRoutes.get("/partner/:partnerId", getPartnerDeliveries);
DeliveryRoutes.get("/ngo/:ngoId", getNgoDeliveries);
DeliveryRoutes.get("/:id", getDeliveryById);
DeliveryRoutes.put("/:id/complete", verifyToken, checkRole("partner"), completeDelivery);
DeliveryRoutes.put("/:id/rate", verifyToken, checkRole("partner", "ngo"), rateDelivery);
DeliveryRoutes.put("/:id/status", verifyToken, checkRole("partner"), updateDeliveryStatus);
DeliveryRoutes.delete("/:id", verifyToken, checkRole("partner"), deleteDelivery);

export default DeliveryRoutes;