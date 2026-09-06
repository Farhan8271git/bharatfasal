import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

import User from "../models/user.model.js";

import {
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../services/otp.service.js";

// Register a new user.
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    console.log("User registered:", user.mobile);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register controller error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to register user",
    });
  }
};

// Authenticate an existing user.
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    console.error("Login controller error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to login",
    });
  }
};

//logout user
export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// Fetch the authenticated user's profile.
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-passwordHash"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        organizationName: user.organizationName || "",
        mobile: user.mobile,
        email: user.email || "",
        village: user.village || "",
        district: user.district,
        state: user.state,
        businessType: user.businessType || "",
        termsAccepted: user.termsAccepted,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get current user",
    });
  }
};

// Verify farmer authorization.
export const farmerTest = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Farmer authorization successful",
    user: req.user,
  });
};

// Generate an OTP for password recovery.
export const sendPasswordOtp = async (req, res) => {
  try {
    await sendOtp(req.body.mobile);

    return res.status(200).json({
      success: true,
      message: "OTP generated successfully",
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to generate OTP",
    });
  }
};

// Verify the password recovery OTP.
export const verifyPasswordOtp = async (req, res) => {
  try {
    await verifyOtp(req.body.mobile, req.body.otp);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to verify OTP",
    });
  }
};

// Reset the user's password using the OTP.
export const resetUserPassword = async (req, res) => {
  try {
    await resetPassword(
      req.body.mobile,
      req.body.otp,
      req.body.newPassword
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to reset password",
    });
  }
};


