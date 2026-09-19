import express from "express";

import {
  getRecommendedBuyersController,
} from "../controllers/buyer.controller.js";

import protect, {
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("farmer", "fpo"));

router.get(
  "/recommended",
  getRecommendedBuyersController
);

export default router;