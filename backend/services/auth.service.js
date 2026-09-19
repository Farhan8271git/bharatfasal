import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

const validateMobile = (mobile) => {
  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new AppError("Invalid mobile number", 400);
  }
};

const validatePassword = (password) => {
  if (typeof password !== "string" || password.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }
};

const sanitizeUser = (user) => ({
  id: user._id,
  role: user.role,
  name: user.name,
  organizationName: user.organizationName || "",
  mobile: user.mobile,
  email: user.email || null,
  village: user.village || "",
  district: user.district,
  state: user.state,
  businessType: user.businessType || "",
  termsAccepted: user.termsAccepted,
});

export const registerUser = async ({
  role,
  name,
  organizationName,
  mobile,
  email,
  village,
  district,
  state,
  businessType,
  password,
  termsAccepted,
}) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedName = String(name || "").trim();
  const normalizedOrganizationName = String(
    organizationName || ""
  ).trim();
  const normalizedMobile = String(mobile || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedVillage = String(village || "").trim();
  const normalizedDistrict = String(district || "").trim();
  const normalizedState = String(state || "").trim();
  const normalizedBusinessType = String(
    businessType || ""
  ).trim();

  if (
    !normalizedRole ||
    !normalizedName ||
    !normalizedMobile ||
    !normalizedDistrict ||
    !normalizedState ||
    !password
  ) {
    throw new AppError("All required fields must be provided", 400);
  }

  const allowedRoles = ["farmer", "fpo", "buyer"];

  if (!allowedRoles.includes(normalizedRole)) {
    throw new AppError("Invalid user role", 400);
  }

  validateMobile(normalizedMobile);
  validatePassword(password);

  if (normalizedRole === "farmer" && !normalizedVillage) {
    throw new AppError("Village is required for farmer", 400);
  }

  if (termsAccepted !== true) {
    throw new AppError("Terms and Conditions must be accepted", 400);
  }

  if (
    normalizedEmail &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw new AppError("Invalid email address", 400);
  }

  const existingMobile = await User.findOne({
    mobile: normalizedMobile,
  });

  if (existingMobile) {
    throw new AppError(
      "An account with this mobile number already exists",
      409
    );
  }

  if (normalizedEmail) {
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      throw new AppError(
        "An account with this email already exists",
        409
      );
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    role: normalizedRole,
    name: normalizedName,
    ...(normalizedOrganizationName && {
      organizationName: normalizedOrganizationName,
    }),
    mobile: normalizedMobile,
    ...(normalizedEmail && {
      email: normalizedEmail,
    }),
    ...(normalizedVillage && {
      village: normalizedVillage,
    }),
    district: normalizedDistrict,
    state: normalizedState,
    ...(normalizedBusinessType && {
      businessType: normalizedBusinessType,
    }),
    passwordHash,
    termsAccepted: true,
  });

  return sanitizeUser(user);
};

export const loginUser = async ({ mobile, password }) => {
  const normalizedMobile = String(mobile || "").trim();

  if (!normalizedMobile || !password) {
    throw new AppError(
      "Mobile number and password are required",
      400
    );
  }

  validateMobile(normalizedMobile);

  const user = await User.findOne({
    mobile: normalizedMobile,
  });

  if (!user) {
    throw new AppError(
      "Invalid mobile number or password",
      401
    );
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatch) {
    throw new AppError(
      "Invalid mobile number or password",
      401
    );
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret is not configured", 500);
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const forgotPasswordUser = async ({ mobile }) => {
  const normalizedMobile = String(mobile || "").trim();

  if (!normalizedMobile) {
    throw new AppError("Mobile number is required", 400);
  }

  validateMobile(normalizedMobile);

  const user = await User.findOne({
    mobile: normalizedMobile,
  });

  if (!user) {
    return {
      message:
        "If an account exists with this mobile number, password reset can be continued.",
    };
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = hashedResetToken;
  user.passwordResetExpires = new Date(
    Date.now() + 15 * 60 * 1000
  );

  await user.save();

  return {
    message: "Password reset request created",
    resetToken,
  };
};

export const resetPassword = async ({
  mobile,
  resetToken,
  newPassword,
}) => {
  const normalizedMobile = String(mobile || "").trim();

  if (!normalizedMobile || !resetToken || !newPassword) {
    throw new AppError(
      "Mobile number, reset token and new password are required",
      400
    );
  }

  validateMobile(normalizedMobile);
  validatePassword(newPassword);

  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    mobile: normalizedMobile,
    passwordResetToken: hashedResetToken,
    passwordResetExpires: {
      $gt: new Date(),
    },
  });

  if (!user) {
    throw new AppError(
      "Invalid or expired password reset token",
      400
    );
  }

  user.passwordHash = await bcrypt.hash(newPassword, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return {
    message: "Password reset successful",
  };
};