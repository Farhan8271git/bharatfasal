import mongoose from "mongoose";
import Order from "../models/order.model.js";

const normalizePagination = (page, limit) => {
  const normalizedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const normalizedLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 20, 1),
    100
  );

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

const validateObjectId = (id, message = "Invalid order ID.") => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

const buildOrderQuery = ({ role, userId, status }) => {
  const query = {};

  if (role === "buyer") {
    query.buyerId = userId;
  }

  if (role === "farmer" || role === "fpo") {
    query.sellerId = userId;
  }

  if (status) {
    query.status = status;
  }

  return query;
};

export const getBuyerOrders = async ({
  buyerId,
  status,
  page,
  limit,
}) => {
  const pagination = normalizePagination(page, limit);

  const query = buildOrderQuery({
    role: "buyer",
    userId: buyerId,
    status,
  });

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate({
        path: "lotId",
        select:
          "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation district state status",
      })
      .populate({
        path: "sellerId",
        select: "name mobile email village district state",
      })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getSellerOrders = async ({
  sellerId,
  status,
  page,
  limit,
}) => {
  const pagination = normalizePagination(page, limit);

  const query = buildOrderQuery({
    role: "farmer",
    userId: sellerId,
    status,
  });

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate({
        path: "lotId",
        select:
          "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation district state status",
      })
      .populate({
        path: "buyerId",
        select: "name mobile email district state businessType",
      })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getOrderById = async ({
  orderId,
  userId,
  role,
}) => {
  validateObjectId(orderId);

  const query = {
    _id: orderId,
  };

  if (role === "buyer") {
    query.buyerId = userId;
  } else if (role === "farmer" || role === "fpo") {
    query.sellerId = userId;
  } else if (role !== "admin") {
    const error = new Error("Access denied.");
    error.statusCode = 403;
    throw error;
  }

  const order = await Order.findOne(query)
    .populate({
      path: "lotId",
      select:
        "commodity quantity reservedQuantity unit grade expectedPrice pickupLocation district state status",
    })
    .populate({
      path: "buyerId",
      select: "name mobile email district state businessType",
    })
    .populate({
      path: "sellerId",
      select: "name mobile email village district state",
    })
    .lean();

  if (!order) {
    const error = new Error("Order not found.");
    error.statusCode = 404;
    throw error;
  }

  return order;
};