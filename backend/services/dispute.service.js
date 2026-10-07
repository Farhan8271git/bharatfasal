import mongoose from "mongoose";

import Dispute from "../models/dispute.model.js";
import Order from "../models/order.model.js";

const DISPUTE_TYPES = [
  "payment_issue",
  "quality_dispute",
  "delivery_issue",
  "other_issue",
];

const ACTIVE_DISPUTE_STATUSES = [
  "open",
  "under_review",
];

const generateDisputeNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `DSP-${timestamp}-${random}`;
};

const validateObjectId = (id, message) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

const normalizeType = (type) => {
  const normalizedType = String(type || "")
    .trim()
    .toLowerCase();

  if (!DISPUTE_TYPES.includes(normalizedType)) {
    const error = new Error("Invalid dispute type.");
    error.statusCode = 400;
    throw error;
  }

  return normalizedType;
};

const buildUserOrderQuery = ({
  orderId,
  userId,
  role,
}) => {
  const query = {
    _id: orderId,
  };

  if (role === "buyer") {
    query.buyerId = userId;
  } else if (
    role === "farmer" ||
    role === "fpo"
  ) {
    query.sellerId = userId;
  } else {
    const error = new Error(
      "Disputes are not available for this role."
    );
    error.statusCode = 403;
    throw error;
  }

  return query;
};

const populateDispute = (query) =>
  query
    .populate({
      path: "orderId",
      select:
        "orderNumber lotId buyerId sellerId quantity unit pricePerUnit totalAmount status paymentStatus fulfillmentStatus pickupLocation deliveryLocation placedAt",
      populate: [
        {
          path: "lotId",
          select:
            "commodity grade expectedPrice unit",
        },
        {
          path: "buyerId",
          select:
            "name organizationName businessType district state",
        },
        {
          path: "sellerId",
          select:
            "name organizationName village district state",
        },
      ],
    })
    .populate({
      path: "filedBy",
      select:
        "name organizationName role mobile email",
    })
    .populate({
      path: "againstUser",
      select:
        "name organizationName role district state",
    });

export const createDispute = async ({
  userId,
  role,
  orderId,
  type,
  description,
}) => {
  validateObjectId(
    orderId,
    "Invalid order ID."
  );

  const normalizedType = normalizeType(type);

  const normalizedDescription = String(
    description || ""
  ).trim();

  if (normalizedDescription.length < 10) {
    const error = new Error(
      "Dispute description must contain at least 10 characters."
    );
    error.statusCode = 400;
    throw error;
  }

  if (normalizedDescription.length > 2000) {
    const error = new Error(
      "Dispute description cannot exceed 2000 characters."
    );
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findOne(
    buildUserOrderQuery({
      orderId,
      userId,
      role,
    })
  ).lean();

  if (!order) {
    const error = new Error(
      "Order not found or access denied."
    );
    error.statusCode = 404;
    throw error;
  }

  const againstUser =
    role === "buyer"
      ? order.sellerId
      : order.buyerId;

  const existingDispute =
    await Dispute.findOne({
      orderId: order._id,
      filedBy: userId,
      type: normalizedType,
      status: {
        $in: ACTIVE_DISPUTE_STATUSES,
      },
    }).lean();

  if (existingDispute) {
    const error = new Error(
      "An active dispute of this type already exists for this order."
    );
    error.statusCode = 409;
    throw error;
  }

  const dispute = await Dispute.create({
    disputeNumber: generateDisputeNumber(),
    orderId: order._id,
    filedBy: userId,
    againstUser,
    type: normalizedType,
    description: normalizedDescription,
    status: "open",
    updates: [
      {
        message: "Dispute filed",
        status: "open",
      },
    ],
  });

  return populateDispute(
    Dispute.findById(dispute._id)
  );
};

export const getMyDisputes = async ({
  userId,
  status,
  page = 1,
  limit = 20,
}) => {
  const currentPage = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const currentLimit = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || 20,
      1
    ),
    100
  );

  const query = {
    filedBy: userId,
  };

  if (status) {
    const normalizedStatus = String(status)
      .trim()
      .toLowerCase();

    const allowedStatuses = [
      "open",
      "under_review",
      "resolved",
      "rejected",
      "cancelled",
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      const error = new Error(
        "Invalid dispute status."
      );
      error.statusCode = 400;
      throw error;
    }

    query.status = normalizedStatus;
  }

  const skip = (currentPage - 1) * currentLimit;

  const [disputes, total] = await Promise.all([
    populateDispute(
      Dispute.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(currentLimit)
        .lean()
    ),

    Dispute.countDocuments(query),
  ]);

  return {
    disputes,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(
        total / currentLimit
      ),
    },
  };
};

export const getDisputeById = async ({
  disputeId,
  userId,
  role,
}) => {
  validateObjectId(
    disputeId,
    "Invalid dispute ID."
  );

  const query = {
    _id: disputeId,
  };

  if (role !== "admin") {
    query.filedBy = userId;
  }

  const dispute = await populateDispute(
    Dispute.findOne(query)
  );

  if (!dispute) {
    const error = new Error(
      "Dispute not found."
    );
    error.statusCode = 404;
    throw error;
  }

  return dispute;
};