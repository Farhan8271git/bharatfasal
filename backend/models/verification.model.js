import mongoose from "mongoose";

// Verification schema
const verificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["buyer", "farmer", "fpo"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    businessName: {
      type: String,
      trim: true,
    },

    companyName: {
      type: String,
      trim: true,
    },

    businessType: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    pan: {
      type: String,
      trim: true,
      uppercase: true,
    },

    gstin: {
      type: String,
      trim: true,
      uppercase: true,
    },

    documents: {
      pan: {
        type: Boolean,
        default: false,
      },

      gst: {
        type: Boolean,
        default: false,
      },

      businessProof: {
        type: Boolean,
        default: false,
      },

      bankProof: {
        type: Boolean,
        default: false,
      },
    },

    bankAccount: {
      type: String,
      trim: true,
    },

    bankName: {
      type: String,
      trim: true,
    },

    ifsc: {
      type: String,
      trim: true,
      uppercase: true,
    },

    upi: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Verification = mongoose.model(
  "Verification",
  verificationSchema
);

export default Verification;