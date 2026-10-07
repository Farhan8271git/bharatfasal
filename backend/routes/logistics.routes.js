import express from "express";

import {
  getWarehousesController,
  getTransportProvidersController,
  createLogisticsBookingController,
  getMyLogisticsBookingsController,
  getLogisticsBookingByIdController,
} from "../controllers/logistics.controller.js";

import {
  protect,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.use(
  authorize("farmer", "fpo", "buyer")
);

router.get(
  "/warehouses",
  getWarehousesController
);

router.get(
  "/transport",
  getTransportProvidersController
);

router.post(
  "/bookings",
  createLogisticsBookingController
);

router.get(
  "/bookings/my",
  getMyLogisticsBookingsController
);

router.get(
  "/bookings/:id",
  getLogisticsBookingByIdController
);

export default router;