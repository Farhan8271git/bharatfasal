import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // account role
    role: {
      type: String,
      enum: ["farmer", "fpo", "buyer", "admin"],
      required: true,
    },

    // basic identity
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // optional organization name
    organizationName: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    // primary mobile number
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // optional email
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // location
    village: {
      type: String,
      required: function () {
        return this.role === "farmer";
      },
    },

    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    state: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    //business type
    businessType: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // hashed password only
    passwordHash: {
      type: String,
      required: true,
    },

    // password reset
    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // registration consent
    termsAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;