import mongoose from "mongoose";

const disputeUpdateSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: [
        "open",
        "under_review",
        "resolved",
        "rejected",
        "cancelled",
      ],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const disputeSchema = new mongoose.Schema(
  {
    disputeNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },

    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    againstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "payment_issue",
        "quality_dispute",
        "delivery_issue",
        "other_issue",
      ],
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "open",
        "under_review",
        "resolved",
        "rejected",
        "cancelled",
      ],
      default: "open",
      index: true,
    },

    resolution: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    updates: {
      type: [disputeUpdateSchema],
      default: [],
    },

    attachments: {
      type: [String],
      default: [],
    },

    filedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

disputeSchema.index({
  filedBy: 1,
  status: 1,
  createdAt: -1,
});

disputeSchema.index({
  againstUser: 1,
  status: 1,
  createdAt: -1,
});

disputeSchema.index({
  orderId: 1,
  createdAt: -1,
});

const Dispute = mongoose.model("Dispute", disputeSchema);

export default Dispute;