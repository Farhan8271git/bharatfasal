import mongoose from "mongoose";

// mandi price schema
const mandiPriceSchema = new mongoose.Schema(
  {
    commodity: {
      type: String,
      required: true,
      trim: true,
    },

    market: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    min_price: {
      type: Number,
      required: true,
      min: 0,
    },

    max_price: {
      type: Number,
      required: true,
      min: 0,
    },

    modal_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// prevent duplicate mandi records
mandiPriceSchema.index(
  {
    commodity: 1,
    market: 1,
    state: 1,
  },
  {
    unique: true,
  }
);

// mandi price model
const MandiPrice = mongoose.model(
  "MandiPrice",
  mandiPriceSchema
);

export default MandiPrice;