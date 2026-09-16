import {
  createBuyerRating,
  getBuyerRating,
  getBuyerRatings,
  getRatingByOrder,
} from "../services/rating.service.js";

const getAuthenticatedUserId = (req) => {
  return req.user?.userId || req.user?.id;
};

export const createBuyerRatingController = async (
  req,
  res
) => {
  try {
    const buyerId = getAuthenticatedUserId(req);

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      orderId,
      rating,
      review,
    } = req.body;

    const createdRating = await createBuyerRating({
      buyerId,
      orderId,
      rating,
      review,
    });

    return res.status(201).json({
      success: true,
      message: "Rating submitted successfully.",
      rating: createdRating,
    });
  } catch (error) {
    const message =
      error?.message || "Unable to submit rating.";

    const statusCode =
      message.includes("not authorized") ||
      message.includes("Only buyers") ||
      message.includes("Authentication")
        ? 403
        : message.includes("already rated")
          ? 409
          : message.includes("not found") ||
              message.includes("Invalid") ||
              message.includes("must be")
            ? 400
            : 500;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const getBuyerRatingController = async (
  req,
  res
) => {
  try {
    const buyerId = getAuthenticatedUserId(req);

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const ratingSummary =
      await getBuyerRating(buyerId);

    return res.status(200).json({
      success: true,
      rating: ratingSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load buyer rating.",
    });
  }
};

export const getBuyerRatingsController = async (
  req,
  res
) => {
  try {
    const buyerId = getAuthenticatedUserId(req);

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const result = await getBuyerRatings({
      buyerId,
      page: req.query.page,
      limit: req.query.limit,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Unable to load buyer ratings.",
    });
  }
};

export const getRatingByOrderController = async (
  req,
  res
) => {
  try {
    const buyerId = getAuthenticatedUserId(req);

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { orderId } = req.params;

    const rating = await getRatingByOrder({
      buyerId,
      orderId,
    });

    return res.status(200).json({
      success: true,
      rating,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Unable to load order rating.",
    });
  }
};