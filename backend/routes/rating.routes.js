import express from "express";

import {
  createBuyerRatingController,
  getBuyerRatingController,
  getBuyerRatingsController,
  getRatingByOrderController,
} from "../controllers/rating.controller.js";

import protect, {
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("buyer"));

router.post("/", createBuyerRatingController);

router.get("/summary", getBuyerRatingController);

router.get("/", getBuyerRatingsController);

router.get("/order/:orderId", getRatingByOrderController);

export default router;