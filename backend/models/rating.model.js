import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
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

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number between 1 and 5.",
      },
    },

    review: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index(
  { orderId: 1, buyerId: 1 },
  { unique: true }
);

ratingSchema.index({
  buyerId: 1,
  createdAt: -1,
});

ratingSchema.index({
  sellerId: 1,
  createdAt: -1,
});

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;