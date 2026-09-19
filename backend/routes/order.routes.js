import express from "express";

import {
  getBuyerOrdersController,
  getSellerOrdersController,
  getOrderByIdController,
} from "../controllers/order.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get(
  "/buyer",
  authorize("buyer"),
  getBuyerOrdersController
);

router.get(
  "/seller",
  authorize("farmer", "fpo"),
  getSellerOrdersController
);

router.get(
  "/:id",
  getOrderByIdController
);

export default router;