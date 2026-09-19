import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";


const otpStore = new Map();

const OTP_EXPIRY = 5 * 60 * 1000;

// Generate and store a password recovery OTP.
export const sendOtp = async (mobile) => {
  const normalizedMobile = String(mobile || "").trim();

  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    throw new AppError("Please enter a valid 10 digit mobile number", 400);
  }

  const user = await User.findOne({
    mobile: normalizedMobile,
  });

  if (!user) {
    throw new AppError("No account found with this mobile number", 404);
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  otpStore.set(normalizedMobile, {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY,
  });

  console.log(`OTP for ${normalizedMobile}: ${otp}`);

  return true;
};

// Verify a password recovery OTP.
export const verifyOtp = async (mobile, otp) => {
  const normalizedMobile = String(mobile || "").trim();
  const normalizedOtp = String(otp || "").trim();

  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    throw new AppError("Invalid mobile number", 400);
  }

  if (!/^\d{6}$/.test(normalizedOtp)) {
    throw new AppError("Invalid OTP", 400);
  }

  const stored = otpStore.get(normalizedMobile);

  if (!stored) {
    throw new AppError("OTP not found or expired", 400);
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(normalizedMobile);

    throw new AppError("OTP has expired", 400);
  }

  if (stored.otp !== normalizedOtp) {
    throw new AppError("Invalid OTP", 400);
  }

  return true;
};

// Reset the user's password after OTP verification.
export const resetPassword = async (
  mobile,
  otp,
  newPassword
) => {
  const normalizedMobile = String(mobile || "").trim();

  await verifyOtp(normalizedMobile, otp);

 if (
  typeof newPassword !== "string" ||
  newPassword.length < 6
) {
  throw new AppError(
    "New password must be at least 6 characters",
    400
  );
}

  const user = await User.findOne({
    mobile: normalizedMobile,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);

  await user.save();

  otpStore.delete(normalizedMobile);

  return true;
};