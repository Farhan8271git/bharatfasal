import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  farmerTest,
  sendPasswordOtp,
  verifyPasswordOtp,
  resetUserPassword,
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", protect, logout);

router.get("/me", protect, getCurrentUser);

router.post("/forgot-password/send-otp", sendPasswordOtp);

router.post("/forgot-password/verify-otp", verifyPasswordOtp);

router.post("/forgot-password/reset", resetUserPassword);

router.get( "/farmer-test", protect, authorize("farmer"), farmerTest);

export default router;