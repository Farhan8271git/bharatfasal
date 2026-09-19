import mongoose from "mongoose";

import Rating from "../models/rating.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const normalizeRating = (rating) => {
  if (!rating) {
    return null;
  }

  return {
    ...rating.toObject(),
    id: rating._id.toString(),
  };
};

const validateObjectId = (id, fieldName) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}.`);
  }
};

export const createBuyerRating = async ({
  buyerId,
  orderId,
  rating,
  review = "",
}) => {
  validateObjectId(buyerId, "buyer ID");
  validateObjectId(orderId, "order ID");

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new Error("Rating must be a whole number between 1 and 5.");
  }

  const normalizedReview = String(review || "").trim();

  if (normalizedReview.length > 1000) {
    throw new Error("Review cannot exceed 1000 characters.");
  }

  const buyer = await User.findById(buyerId).select("_id role");

  if (!buyer) {
    throw new Error("Buyer not found.");
  }

  if (buyer.role !== "buyer") {
    throw new Error("Only buyers can submit buyer ratings.");
  }

  const order = await Order.findById(orderId).select(
    "_id buyerId sellerId status"
  );

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.buyerId.toString() !== buyerId.toString()) {
    throw new Error("You are not authorized to rate this order.");
  }

  if (
    !["completed", "delivered"].includes(order.status)
  ) {
    throw new Error(
      "Rating can only be submitted for a completed or delivered order."
    );
  }

  const existingRating = await Rating.findOne({
    orderId,
    buyerId,
  });

  if (existingRating) {
    throw new Error("You have already rated this order.");
  }

  const createdRating = await Rating.create({
    orderId,
    buyerId,
    sellerId: order.sellerId,
    rating: numericRating,
    review: normalizedReview,
  });

  return normalizeRating(createdRating);
};

export const getBuyerRating = async (buyerId) => {
  validateObjectId(buyerId, "buyer ID");

  const buyer = await User.findById(buyerId).select("_id role");

  if (!buyer) {
    throw new Error("Buyer not found.");
  }

  if (buyer.role !== "buyer") {
    throw new Error("User is not a buyer.");
  }

  const result = await Rating.aggregate([
    {
      $match: {
        buyerId: new mongoose.Types.ObjectId(buyerId),
      },
    },
    {
      $group: {
        _id: "$buyerId",
        averageRating: {
          $avg: "$rating",
        },
        totalRatings: {
          $sum: 1,
        },
      },
    },
  ]);

  if (!result.length) {
    return {
      averageRating: null,
      totalRatings: 0,
    };
  }

  return {
    averageRating:
      Math.round(result[0].averageRating * 10) / 10,
    totalRatings: result[0].totalRatings,
  };
};

export const getBuyerRatings = async ({
  buyerId,
  page = 1,
  limit = 10,
}) => {
  validateObjectId(buyerId, "buyer ID");

  const normalizedPage = Math.max(
    1,
    Number.parseInt(page, 10) || 1
  );

  const normalizedLimit = Math.min(
    50,
    Math.max(1, Number.parseInt(limit, 10) || 10)
  );

  const skip =
    (normalizedPage - 1) * normalizedLimit;

  const [ratings, total] = await Promise.all([
    Rating.find({ buyerId })
      .populate(
        "sellerId",
        "name organizationName mobile email"
      )
      .populate(
        "orderId",
        "orderNumber quantity unit pricePerUnit totalAmount status"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(normalizedLimit)
      .lean(),

    Rating.countDocuments({ buyerId }),
  ]);

  return {
    ratings: ratings.map((rating) => ({
      ...rating,
      id: rating._id.toString(),
    })),
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages: Math.ceil(
        total / normalizedLimit
      ),
    },
  };
};

export const getRatingByOrder = async ({
  buyerId,
  orderId,
}) => {
  validateObjectId(buyerId, "buyer ID");
  validateObjectId(orderId, "order ID");

  const rating = await Rating.findOne({
    buyerId,
    orderId,
  })
    .populate(
      "sellerId",
      "name organizationName mobile email"
    )
    .populate(
      "orderId",
      "orderNumber quantity unit pricePerUnit totalAmount status"
    )
    .lean();

  if (!rating) {
    return null;
  }

  return {
    ...rating,
    id: rating._id.toString(),
  };
};