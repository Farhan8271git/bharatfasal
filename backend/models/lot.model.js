import mongoose from 'mongoose'

const lotSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    commodity: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },

    reservedQuantity: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator(value) {
          return value <= this.quantity
        },
        message: 'Reserved quantity cannot exceed total quantity.',
      },
    },

    unit: {
      type: String,
      enum: ['quintal'],
      default: 'quintal',
      required: true,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    expectedPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    availableDate: {
      type: Date,
      required: true,
    },

    transportation: {
      type: String,
      enum: ['seller', 'buyer', 'platform'],
      default: 'buyer',
      required: true,
    },

    status: {
      type: String,
      enum: [
        'draft',
        'listed',
        'reserved',
        'sold',
        'cancelled',
      ],
      default: 'listed',
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

lotSchema.index({
  sellerId: 1,
  status: 1,
})

lotSchema.index({
  commodity: 1,
  status: 1,
})

lotSchema.index({
  availableDate: 1,
  status: 1,
})

const Lot = mongoose.model('Lot', lotSchema)

export default Lot