import express from "express";

import {
  register,
  login,
  getCurrentUser,
  farmerTest,
  forgotPassword,
  resetPasswordController,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

// register new user
router.post("/register", register);

// login existing user
router.post("/login", login);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password", resetPasswordController);

// get current authenticated user
router.get("/me", protect, getCurrentUser);

// farmer authorization test
router.get(
  "/farmer-test",
  protect,
  authorize("farmer"),
  farmerTest
);

export default router;