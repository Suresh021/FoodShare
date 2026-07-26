import express from "express";
import {
    login,
    signup
} from "../controllers/authController.js";

const AuthRoutes = express.Router();
AuthRoutes.post("/signup", signup);
AuthRoutes.post("/login", login);

export default AuthRoutes;