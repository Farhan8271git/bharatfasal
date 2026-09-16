import mongoose from "mongoose";

const demandSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    commodity: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
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

    grade: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    estimatedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    deadline: {
      type: Date,
      required: true,
    },

    transportation: {
      type: String,
      enum: ["seller", "buyer", "platform"],
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "fulfilled", "cancelled", "expired"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

demandSchema.index({
  buyerId: 1,
  status: 1,
  createdAt: -1,
});

demandSchema.index({
  commodity: 1,
  status: 1,
  deadline: 1,
});

const Demand = mongoose.model("Demand", demandSchema);

export default Demand;