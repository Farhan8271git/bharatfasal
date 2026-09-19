import express from "express";

import {
  submitBuyerVerification,
  getMyVerification,
} from "../controllers/verification.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/buyer", protect, submitBuyerVerification);

router.get("/me", protect, getMyVerification);

export default router;