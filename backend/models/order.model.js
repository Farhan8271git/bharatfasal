import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    purchaseRequestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseRequest",
      required: true,
      unique: true,
      index: true,
    },

    lotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lot",
      required: true,
      index: true,
    },

    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    unit: {
      type: String,
      enum: ["quintal"],
      required: true,
      default: "quintal",
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    transportation: {
      type: String,
      enum: ["seller", "buyer", "platform"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "ready_for_pickup",
        "in_transit",
        "delivered",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "confirmed",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "pending",
      index: true,
    },

    fulfillmentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "ready_for_pickup",
        "in_transit",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    deliveryLocation: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },

    confirmedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  buyerId: 1,
  status: 1,
});

orderSchema.index({
  sellerId: 1,
  status: 1,
});

orderSchema.index({
  lotId: 1,
  status: 1,
});

orderSchema.index({
  paymentStatus: 1,
  status: 1,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;