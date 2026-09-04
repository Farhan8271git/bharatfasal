import express from "express";

import {
  getMandiPrices,
} from "../services/mandi.service.js";

const router = express.Router();

// get mandi prices
router.get("/", async (req, res) => {
  try {
    const data = await getMandiPrices();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Mandi route error:", error);

    return res.status(error.status || 500).json({
      success: false,
      message:
        error.message || "Unable to fetch mandi prices",
      ...(error.details && {
        details: error.details,
      }),
    });
  }
});

export default router;