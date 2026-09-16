import express from "express";

import {
  createDemandController,
  getBuyerDemandsController,
  getMarketDemandsController,
  getDemandByIdController,
  cancelDemandController,
} from "../controllers/demand.controller.js";

import protect, {
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/market",
  authorize("farmer", "fpo"),
  getMarketDemandsController
);

router.post(
  "/",
  authorize("buyer"),
  createDemandController
);

router.get(
  "/my",
  authorize("buyer"),
  getBuyerDemandsController
);

router.get(
  "/:id",
  authorize("buyer"),
  getDemandByIdController
);

router.delete(
  "/:id",
  authorize("buyer"),
  cancelDemandController
);

export default router;