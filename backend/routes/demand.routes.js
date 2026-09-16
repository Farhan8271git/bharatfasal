import express from "express";

import {
  createDemandController,
  getBuyerDemandsController,
  getDemandByIdController,
  cancelDemandController,
} from "../controllers/demand.controller.js";

import protect, {
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("buyer"));

router.post("/", createDemandController);
router.get("/my", getBuyerDemandsController);
router.get("/:id", getDemandByIdController);
router.delete("/:id", cancelDemandController);

export default router;