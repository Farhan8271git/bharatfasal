import mongoose from "mongoose";

import Warehouse from "../models/warehouse.model.js";
import TransportProvider from "../models/transportProvider.model.js";
import LogisticsBooking from "../models/logisticsBooking.model.js";

const BOOKING_TYPES = ["storage", "transport"];

const generateBookingNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `LOG-${timestamp}-${random}`;
};

const validateObjectId = (id, message) => {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error(message);
    error.statusCode = 400;
    throw error;
  }
};

const normalizePagination = (page, limit) => {
  const normalizedPage = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

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

export const getWarehouses = async ({
  district,
  state,
  page,
  limit,
}) => {
  const pagination = normalizePagination(page, limit);

  const query = {
    status: "active",
  };

  if (district) {
    query.district = String(district).trim();
  }

  if (state) {
    query.state = String(state).trim();
  }

  const [warehouses, total] = await Promise.all([
    Warehouse.find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Warehouse.countDocuments(query),
  ]);

  return {
    warehouses,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getTransportProviders = async ({
  page,
  limit,
}) => {
  const pagination = normalizePagination(page, limit);

  const query = {
    status: "active",
  };

  const [transportProviders, total] = await Promise.all([
    TransportProvider.find(query)
      .sort({ available: -1, createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    TransportProvider.countDocuments(query),
  ]);

  return {
    transportProviders,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const createLogisticsBooking = async ({
  userId,
  type,
  warehouseId,
  transportProviderId,
  quantity,
  pickupLocation,
  destination,
  startDate,
  endDate,
  distanceKm,
}) => {
  if (!mongoose.isValidObjectId(userId)) {
    const error = new Error("Invalid user ID.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedType = String(type || "")
    .trim()
    .toLowerCase();

  if (!BOOKING_TYPES.includes(normalizedType)) {
    const error = new Error("Invalid logistics booking type.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedQuantity = Number(quantity);

  if (!Number.isFinite(normalizedQuantity) || normalizedQuantity <= 0) {
    const error = new Error("Quantity must be greater than zero.");
    error.statusCode = 400;
    throw error;
  }

  if (!startDate || Number.isNaN(new Date(startDate).getTime())) {
    const error = new Error("Valid start date is required.");
    error.statusCode = 400;
    throw error;
  }

  if (
    endDate &&
    Number.isNaN(new Date(endDate).getTime())
  ) {
    const error = new Error("Invalid end date.");
    error.statusCode = 400;
    throw error;
  }

  if (
    endDate &&
    new Date(endDate) < new Date(startDate)
  ) {
    const error = new Error(
      "End date cannot be before start date."
    );
    error.statusCode = 400;
    throw error;
  }

  let estimatedAmount = 0;

  if (normalizedType === "storage") {
    if (!warehouseId) {
      const error = new Error(
        "Warehouse is required for storage booking."
      );
      error.statusCode = 400;
      throw error;
    }

    validateObjectId(
      warehouseId,
      "Invalid warehouse ID."
    );

    const warehouse = await Warehouse.findOne({
      _id: warehouseId,
      status: "active",
    }).lean();

    if (!warehouse) {
      const error = new Error("Warehouse not found.");
      error.statusCode = 404;
      throw error;
    }

    if (normalizedQuantity > warehouse.availableCapacity) {
      const error = new Error(
        "Requested quantity exceeds available warehouse capacity."
      );
      error.statusCode = 400;
      throw error;
    }

    const start = new Date(startDate);
    const end = endDate
      ? new Date(endDate)
      : new Date(start);

    const days = Math.max(
      1,
      Math.ceil(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    estimatedAmount =
      normalizedQuantity *
      warehouse.ratePerQuintal *
      (days / 30);
  }

  if (normalizedType === "transport") {
    if (!transportProviderId) {
      const error = new Error(
        "Transport provider is required for transport booking."
      );
      error.statusCode = 400;
      throw error;
    }

    validateObjectId(
      transportProviderId,
      "Invalid transport provider ID."
    );

    const provider = await TransportProvider.findOne({
      _id: transportProviderId,
      status: "active",
    }).lean();

    if (!provider) {
      const error = new Error(
        "Transport provider not found."
      );
      error.statusCode = 404;
      throw error;
    }

    if (!provider.available) {
      const error = new Error(
        "Selected transport provider is currently unavailable."
      );
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(Number(distanceKm)) || Number(distanceKm) <= 0) {
      const error = new Error(
        "Valid distance is required for transport booking."
      );
      error.statusCode = 400;
      throw error;
    }

    if (normalizedQuantity > provider.vehicleCapacity) {
      const error = new Error(
        "Requested quantity exceeds vehicle capacity."
      );
      error.statusCode = 400;
      throw error;
    }

    estimatedAmount =
      Number(distanceKm) * provider.pricePerKm;
  }

  const booking = await LogisticsBooking.create({
    bookingNumber: generateBookingNumber(),
    userId,
    type: normalizedType,
    warehouseId:
      normalizedType === "storage"
        ? warehouseId
        : null,
    transportProviderId:
      normalizedType === "transport"
        ? transportProviderId
        : null,
    quantity: normalizedQuantity,
    pickupLocation: pickupLocation || "",
    destination: destination || "",
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
    distanceKm:
      normalizedType === "transport"
        ? Number(distanceKm)
        : null,
    estimatedAmount: Math.round(estimatedAmount * 100) / 100,
  });

  return getLogisticsBookingById({
    bookingId: booking._id,
    userId,
  });
};

export const getMyLogisticsBookings = async ({
  userId,
  page,
  limit,
}) => {
  const pagination = normalizePagination(page, limit);

  const query = {
    userId,
  };

  const [bookings, total] = await Promise.all([
    LogisticsBooking.find(query)
      .populate({
        path: "warehouseId",
        select:
          "name type location district state ratePerQuintal",
      })
      .populate({
        path: "transportProviderId",
        select:
          "providerName vehicleType vehicleCapacity pricePerKm driverName",
      })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    LogisticsBooking.countDocuments(query),
  ]);

  return {
    bookings,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

export const getLogisticsBookingById = async ({
  bookingId,
  userId,
}) => {
  validateObjectId(
    bookingId,
    "Invalid logistics booking ID."
  );

  const booking = await LogisticsBooking.findOne({
    _id: bookingId,
    userId,
  })
    .populate({
      path: "warehouseId",
      select:
        "name type location district state capacity availableCapacity ratePerQuintal rating",
    })
    .populate({
      path: "transportProviderId",
      select:
        "providerName vehicleType vehicleCapacity pricePerKm driverName driverPhone rating available",
    })
    .lean();

  if (!booking) {
    const error = new Error(
      "Logistics booking not found."
    );
    error.statusCode = 404;
    throw error;
  }

  return booking;
};