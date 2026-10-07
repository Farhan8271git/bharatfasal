import express from "express";

import {
  createDisputeController,
  getMyDisputesController,
  getDisputeByIdController,
} from "../controllers/dispute.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.use(
  authorize("buyer", "farmer", "fpo")
);

router.post(
  "/",
  createDisputeController
);

router.get(
  "/my",
  getMyDisputesController
);

router.get(
  "/:id",
  getDisputeByIdController
);

export default router;