import mongoose from "mongoose";

const logisticsBookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["storage", "transport"],
      required: true,
      index: true,
    },

    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
      index: true,
    },

    transportProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransportProvider",
      default: null,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    pickupLocation: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    destination: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      default: null,
    },

    distanceKm: {
      type: Number,
      min: 0,
      default: null,
    },

    estimatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

logisticsBookingSchema.index({
  userId: 1,
  status: 1,
});

logisticsBookingSchema.index({
  type: 1,
  createdAt: -1,
});

const LogisticsBooking = mongoose.model(
  "LogisticsBooking",
  logisticsBookingSchema
);

export default LogisticsBooking;