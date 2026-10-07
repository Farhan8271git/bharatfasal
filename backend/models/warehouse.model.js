import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    type: {
      type: String,
      enum: ["godown", "cold_storage"],
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 0,
    },

    availableCapacity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator(value) {
          return value <= this.capacity;
        },
        message: "Available capacity cannot exceed total capacity.",
      },
    },

    ratePerQuintal: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
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

warehouseSchema.index({
  state: 1,
  district: 1,
  status: 1,
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);

export default Warehouse;