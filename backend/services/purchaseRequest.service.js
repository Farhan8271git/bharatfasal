import mongoose from "mongoose";

import Lot from "../models/lot.model.js";
import PurchaseRequest from "../models/purchaseRequest.model.js";

const SELLER_ROLES = ["farmer", "fpo"];

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const normalizeQuantity = (quantity) => {
  const value = Number(quantity);

  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  return value;
};

const createPurchaseRequest = async ({
  buyerId,
  lotId,
  quantity,
  buyerNote = "",
}) => {
  if (!isValidObjectId(buyerId)) {
    throw new Error("Invalid buyer ID.");
  }

  if (!isValidObjectId(lotId)) {
    throw new Error("Invalid lot ID.");
  }

  const requestedQuantity = normalizeQuantity(quantity);

  const lot = await Lot.findById(lotId).populate(
    "sellerId",
    "name organizationName role"
  );

  if (!lot) {
    throw new Error("Lot not found.");
  }

  if (lot.status !== "listed") {
    throw new Error(
      "Purchase requests can only be created for listed lots."
    );
  }

  if (!lot.sellerId) {
    throw new Error("Seller information is unavailable.");
  }

  if (!SELLER_ROLES.includes(lot.sellerId.role)) {
    throw new Error("Lot seller is not eligible for marketplace requests.");
  }

  if (String(lot.sellerId._id) === String(buyerId)) {
    throw new Error("You cannot purchase your own lot.");
  }

  if (requestedQuantity > lot.quantity) {
    throw new Error(
      `Requested quantity cannot exceed the available quantity of ${lot.quantity} quintals.`
    );
  }

  const existingRequest = await PurchaseRequest.findOne({
    lotId: lot._id,
    buyerId,
    status: "pending",
  });

  if (existingRequest) {
    throw new Error(
      "You already have a pending purchase request for this lot."
    );
  }

  const offeredPrice = Number(lot.expectedPrice);

  if (!Number.isFinite(offeredPrice) || offeredPrice < 0) {
    throw new Error("Lot price is invalid.");
  }

  const totalAmount = requestedQuantity * offeredPrice;

  const purchaseRequest = await PurchaseRequest.create({
    lotId: lot._id,
    buyerId,
    sellerId: lot.sellerId._id,
    quantity: requestedQuantity,
    unit: lot.unit,
    offeredPrice,
    totalAmount,
    transportation: lot.transportation,
    buyerNote: String(buyerNote).trim(),
    status: "pending",
  });

  return PurchaseRequest.findById(purchaseRequest._id)
    .populate(
      "lotId",
      "commodity quantity unit grade expectedPrice pickupLocation availableDate transportation status"
    )
    .populate(
      "buyerId",
      "name organizationName mobile email"
    )
    .populate(
      "sellerId",
      "name organizationName role"
    )
    .lean();
};

const getBuyerPurchaseRequests = async ({
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

  const [requests, total] = await Promise.all([
    PurchaseRequest.find(filter)
      .populate(
        "lotId",
        "commodity quantity unit grade expectedPrice pickupLocation availableDate transportation status"
      )
      .populate(
        "sellerId",
        "name organizationName role district state"
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    PurchaseRequest.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

const getSellerPurchaseRequests = async ({
  sellerId,
  status,
  page = 1,
  limit = 20,
}) => {
  if (!isValidObjectId(sellerId)) {
    throw new Error("Invalid seller ID.");
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  const filter = {
    sellerId,
  };

  if (status) {
    filter.status = status;
  }

  const [requests, total] = await Promise.all([
    PurchaseRequest.find(filter)
      .populate(
        "lotId",
        "commodity quantity unit grade expectedPrice pickupLocation availableDate transportation status"
      )
      .populate(
        "buyerId",
        "name organizationName mobile email businessType"
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),

    PurchaseRequest.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: {
      page: currentPage,
      limit: pageLimit,
      total,
      totalPages: Math.ceil(total / pageLimit),
    },
  };
};

const getPurchaseRequestById = async ({
  requestId,
  userId,
}) => {
  if (!isValidObjectId(requestId)) {
    throw new Error("Invalid purchase request ID.");
  }

  if (!isValidObjectId(userId)) {
    throw new Error("Invalid user ID.");
  }

  const request = await PurchaseRequest.findById(requestId)
    .populate(
      "lotId",
      "commodity quantity unit grade expectedPrice pickupLocation availableDate transportation status"
    )
    .populate(
      "buyerId",
      "name organizationName mobile email businessType"
    )
    .populate(
      "sellerId",
      "name organizationName role district state"
    )
    .lean();

  if (!request) {
    throw new Error("Purchase request not found.");
  }

  const isBuyer = String(request.buyerId?._id) === String(userId);
  const isSeller = String(request.sellerId?._id) === String(userId);

  if (!isBuyer && !isSeller) {
    throw new Error("Access denied.");
  }

  return request;
};

export {
  createPurchaseRequest,
  getBuyerPurchaseRequests,
  getSellerPurchaseRequests,
  getPurchaseRequestById,
};