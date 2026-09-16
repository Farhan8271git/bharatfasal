import express from "express";

import {
  createPurchaseRequestController,
  getBuyerPurchaseRequestsController,
  getSellerPurchaseRequestsController,
  getPurchaseRequestByIdController,
  respondToPurchaseRequestController,
} from "../controllers/purchaseRequest.controller.js";

import {
  authorize,
  protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  authorize("buyer"),
  createPurchaseRequestController
);

router.get(
  "/buyer",
  authorize("buyer"),
  getBuyerPurchaseRequestsController
);

router.get(
  "/seller",
  authorize("farmer", "fpo"),
  getSellerPurchaseRequestsController
);

router.patch(
  "/:id/respond",
  authorize("farmer", "fpo"),
  respondToPurchaseRequestController
);

router.get(
  "/:id",
  getPurchaseRequestByIdController
);

export default router;