import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import { getCurrentUser } from "../controllers/auth.controller.js";

const router = express.Router();

// register new user
router.post("/register", register);

// login existing user
router.post("/login", login);

// get current authenticated user
router.get("/me", protect, getCurrentUser);

export default router;