import mongoose from "mongoose";

const transportProviderSchema = new mongoose.Schema(
  {
    providerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    vehicleType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    vehicleCapacity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    pricePerKm: {
      type: Number,
      required: true,
      min: 0,
    },

    driverName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    driverPhone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

transportProviderSchema.index({
  available: 1,
  status: 1,
});

const TransportProvider = mongoose.model(
  "TransportProvider",
  transportProviderSchema
);

export default TransportProvider;