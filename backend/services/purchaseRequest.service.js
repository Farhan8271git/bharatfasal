import mongoose from "mongoose";

import Lot from "../models/lot.model.js";
import Order from "../models/order.model.js";
import PurchaseRequest from "../models/purchaseRequest.model.js";
import User from "../models/user.model.js";

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

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `BF-${timestamp}-${randomPart}`;
};

const populatePurchaseRequest = (requestId) => {
  return PurchaseRequest.findById(requestId)
    .populate(
      "lotId",
      "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation availableDate transportation status"
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

  const reservedQuantity = Number(lot.reservedQuantity) || 0;
  const availableQuantity = lot.quantity - reservedQuantity;

  if (requestedQuantity > availableQuantity) {
    throw new Error(
      `Requested quantity cannot exceed the available quantity of ${availableQuantity} quintals.`
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

  return populatePurchaseRequest(purchaseRequest._id);
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
        "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation availableDate transportation status"
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
        "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation availableDate transportation status"
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

  const request = await populatePurchaseRequest(requestId);

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

const respondToPurchaseRequest = async ({
  requestId,
  sellerId,
  action,
  sellerNote = "",
}) => {
  if (!isValidObjectId(requestId)) {
    throw new Error("Invalid purchase request ID.");
  }

  if (!isValidObjectId(sellerId)) {
    throw new Error("Invalid seller ID.");
  }

  if (!["accept", "reject"].includes(action)) {
    throw new Error(
      "Invalid action. Action must be either accept or reject."
    );
  }

  const seller = await User.findById(sellerId).select("role");

  if (!seller || !SELLER_ROLES.includes(seller.role)) {
    throw new Error(
      "Seller is not eligible to respond to purchase requests."
    );
  }

  const normalizedSellerNote = String(sellerNote).trim();

  if (action === "reject") {
    const purchaseRequest = await PurchaseRequest.findOneAndUpdate(
      {
        _id: requestId,
        sellerId,
        status: "pending",
      },
      {
        $set: {
          status: "rejected",
          sellerNote: normalizedSellerNote,
          respondedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

    if (!purchaseRequest) {
      const existingRequest = await PurchaseRequest.findById(requestId);

      if (!existingRequest) {
        throw new Error("Purchase request not found.");
      }

      if (String(existingRequest.sellerId) !== String(sellerId)) {
        throw new Error("Access denied.");
      }

      throw new Error(
        "Only pending purchase requests can be accepted or rejected."
      );
    }

    return populatePurchaseRequest(purchaseRequest._id);
  }

  const session = await mongoose.startSession();

  try {
    let orderId;

    await session.withTransaction(async () => {
      const purchaseRequest = await PurchaseRequest.findOne({
        _id: requestId,
        sellerId,
        status: "pending",
      }).session(session);

      if (!purchaseRequest) {
        const existingRequest = await PurchaseRequest.findById(
          requestId
        ).session(session);

        if (!existingRequest) {
          throw new Error("Purchase request not found.");
        }

        if (String(existingRequest.sellerId) !== String(sellerId)) {
          throw new Error("Access denied.");
        }

        throw new Error(
          "Only pending purchase requests can be accepted or rejected."
        );
      }

      const requestedQuantity = Number(purchaseRequest.quantity);

      if (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0) {
        throw new Error("Purchase request quantity is invalid.");
      }

      const lot = await Lot.findOneAndUpdate(
        {
          _id: purchaseRequest.lotId,
          sellerId,
          status: "listed",
          $expr: {
            $gte: [
              {
                $subtract: [
                  "$quantity",
                  {
                    $ifNull: ["$reservedQuantity", 0],
                  },
                ],
              },
              requestedQuantity,
            ],
          },
        },
        {
          $inc: {
            reservedQuantity: requestedQuantity,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!lot) {
        throw new Error(
          "The lot no longer has enough available quantity for this purchase request."
        );
      }

      if (lot.reservedQuantity >= lot.quantity) {
        lot.status = "reserved";
        await lot.save({ session });
      }

      const order = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            purchaseRequestId: purchaseRequest._id,
            lotId: purchaseRequest.lotId,
            buyerId: purchaseRequest.buyerId,
            sellerId: purchaseRequest.sellerId,
            quantity: requestedQuantity,
            unit: purchaseRequest.unit,
            pricePerUnit: purchaseRequest.offeredPrice,
            totalAmount: purchaseRequest.totalAmount,
            transportation: purchaseRequest.transportation,
            status: "confirmed",
            paymentStatus: "pending",
            fulfillmentStatus: "pending",
            pickupLocation: lot.pickupLocation,
            deliveryLocation: "",
            placedAt: purchaseRequest.createdAt,
            confirmedAt: new Date(),
          },
        ],
        { session }
      );

      orderId = order[0]._id;

      purchaseRequest.status = "accepted";
      purchaseRequest.sellerNote = normalizedSellerNote;
      purchaseRequest.respondedAt = new Date();

      await purchaseRequest.save({ session });
    });

    const [request, order] = await Promise.all([
      populatePurchaseRequest(requestId),
      Order.findById(orderId)
        .populate(
          "lotId",
          "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation availableDate transportation status"
        )
        .populate(
          "buyerId",
          "name organizationName mobile email businessType"
        )
        .populate(
          "sellerId",
          "name organizationName role district state"
        )
        .lean(),
    ]);

    return {
      request,
      order,
    };
  } finally {
    await session.endSession();
  }
};

export {
  createPurchaseRequest,
  getBuyerPurchaseRequests,
  getSellerPurchaseRequests,
  getPurchaseRequestById,
  respondToPurchaseRequest,
};