import express from "express";
import {
    claimFood,
    createFoodListing,
    deleteFoodListing,
    getAllFoodListings,
    getAvailableFoods,
    getFoodByDonor,
    getFoodListingById,
    searchFoods,
    unclaimFood,
    updateFoodListing
} from "../controllers/foodController.js";
import { checkRole, verifyToken } from "../middleware/authMiddleware.js";

const FoodRoutes = express.Router();
FoodRoutes.post("/", verifyToken, checkRole("donor"), createFoodListing);
FoodRoutes.get("/", getAllFoodListings);
FoodRoutes.get("/available", getAvailableFoods);
FoodRoutes.get("/search", searchFoods);
FoodRoutes.get("/donor/:donorId", getFoodByDonor);
FoodRoutes.get("/:id", getFoodListingById);
FoodRoutes.put("/:id", verifyToken, checkRole("donor"), updateFoodListing);
FoodRoutes.put("/:id/claim", verifyToken, checkRole("partner"), claimFood);
FoodRoutes.put("/:id/unclaim", verifyToken, checkRole("partner"), unclaimFood);
FoodRoutes.delete("/:id", verifyToken, checkRole("donor"), deleteFoodListing);

export default FoodRoutes;