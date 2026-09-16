import mongoose from "mongoose";

import Demand from "../models/demand.model.js";

const BUYER_ROLE = "buyer";

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const normalizeRequiredString = (value, fieldName, maxLength) => {
  const normalized = String(value || "").trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters.`);
  }

  return normalized;
};

const normalizePositiveNumber = (value, fieldName) => {
  const normalized = Number(value);

  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw new Error(`${fieldName} must be greater than zero.`);
  }

  return normalized;
};

const normalizeNonNegativeNumber = (value, fieldName) => {
  const normalized = Number(value);

  if (!Number.isFinite(normalized) || normalized < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number.`);
  }

  return normalized;
};

const normalizeDeadline = (value) => {
  const deadline = new Date(value);

  if (Number.isNaN(deadline.getTime())) {
    throw new Error("Deadline is invalid.");
  }

  if (deadline <= new Date()) {
    throw new Error("Deadline must be in the future.");
  }

  return deadline;
};

const normalizeTransportation = (value) => {
  const transportation = String(value || "").trim().toLowerCase();

  if (!["seller", "buyer", "platform"].includes(transportation)) {
    throw new Error("Transportation option is invalid.");
  }

  return transportation;
};

const createDemand = async ({
  buyerId,
  commodity,
  quantity,
  grade,
  estimatedPrice,
  deliveryLocation,
  deadline,
  transportation,
}) => {
  if (!isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID.");
  }

  const normalizedCommodity = normalizeRequiredString(
    commodity,
    "Commodity",
    100
  );

  const normalizedQuantity = normalizePositiveNumber(
    quantity,
    "Quantity"
  );

  const normalizedGrade = normalizeRequiredString(
    grade,
    "Grade",
    50
  );

  const normalizedEstimatedPrice = normalizeNonNegativeNumber(
    estimatedPrice,
    "Estimated price"
  );

  const normalizedDeliveryLocation = normalizeRequiredString(
    deliveryLocation,
    "Delivery location",
    200
  );

  const normalizedDeadline = normalizeDeadline(deadline);

  const normalizedTransportation =
    normalizeTransportation(transportation);

  const demand = await Demand.create({
    buyerId,
    commodity: normalizedCommodity,
    quantity: normalizedQuantity,
    unit: "quintal",
    grade: normalizedGrade,
    estimatedPrice: normalizedEstimatedPrice,
    deliveryLocation: normalizedDeliveryLocation,
    deadline: normalizedDeadline,
    transportation: normalizedTransportation,
    status: "active",
  });

  return Demand.findById(demand._id)
    .populate(
      "buyerId",
      "name organizationName mobile email businessType district state"
    )
    .lean();
};

const getBuyerDemands = async ({
  buyerId,
  status,
  page = 1,
  limit = 20,
}) => {
  if (!isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID.");
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter = {
    buyerId,
  };

  if (status) {
    filter.status = status;
  }

  const [demands, total] = await Promise.all([
    Demand.find(filter)
      .populate(
        "buyerId",
        "name organizationName mobile email businessType district state"
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    Demand.countDocuments(filter),
  ]);

  return {
    demands,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

const getDemandById = async ({
  demandId,
  userId,
}) => {
  if (!isValidObjectId(demandId)) {
    throw new Error("Invalid demand ID.");
  }

  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID.");
  }

  const demand = await Demand.findById(demandId)
    .populate(
      "buyerId",
      "name organizationName mobile email businessType district state"
    )
    .lean();

  if (!demand) {
    throw new Error("Demand not found.");
  }

  if (String(demand.buyerId?._id) !== String(userId)) {
    throw new Error("Access denied.");
  }

  return demand;
};

const cancelDemand = async ({
  demandId,
  buyerId,
}) => {
  if (!isValidObjectId(demandId)) {
    throw new Error("Invalid demand ID.");
  }

  if (!isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID.");
  }

  const demand = await Demand.findOneAndUpdate(
    {
      _id: demandId,
      buyerId,
      status: "active",
    },
    {
      $set: {
        status: "cancelled",
      },
    },
    {
      new: true,
    }
  )
    .populate(
      "buyerId",
      "name organizationName mobile email businessType district state"
    )
    .lean();

  if (!demand) {
    throw new Error(
      "Active demand not found or it is no longer available."
    );
  }

  return demand;
};

export {
  createDemand,
  getBuyerDemands,
  getDemandById,
  cancelDemand,
  BUYER_ROLE,
};