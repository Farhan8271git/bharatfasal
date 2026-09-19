import { getRecommendedBuyers } from "../services/buyer.service.js";

const getAuthenticatedUserId = (req) => {
  return req.user?.userId || req.user?.id;
};

export const getRecommendedBuyersController = async (req, res) => {
  try {
    const farmerId = getAuthenticatedUserId(req);

    if (!farmerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { lotId, page, limit } = req.query;

    if (!lotId) {
      return res.status(400).json({
        success: false,
        message: "Lot ID is required.",
      });
    }

    const result = await getRecommendedBuyers({
      farmerId,
      lotId,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message = error?.message || "Unable to load recommended buyers.";

    if (
      message.includes("Invalid farmer ID") ||
      message.includes("Invalid lot ID") ||
      message.includes("Lot ID is required")
    ) {
      return res.status(400).json({
        success: false,
        message,
      });
    }

    if (message.includes("Active lot not found")) {
      return res.status(404).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message,
    });
  }
};