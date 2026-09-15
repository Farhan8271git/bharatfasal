import mongoose from "mongoose";

const purchaseRequestSchema = new mongoose.Schema(
  {
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
      default: "quintal",
      required: true,
    },

    offeredPrice: {
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
        "accepted",
        "rejected",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    buyerNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    sellerNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

purchaseRequestSchema.index({
  buyerId: 1,
  status: 1,
});

purchaseRequestSchema.index({
  sellerId: 1,
  status: 1,
});

purchaseRequestSchema.index({
  lotId: 1,
  status: 1,
});

const PurchaseRequest = mongoose.model(
  "PurchaseRequest",
  purchaseRequestSchema
);

export default PurchaseRequest;