import {
  registerUser,
  loginUser,
  forgotPasswordUser,
  resetPassword,
} from "../services/auth.service.js";

// register user
export const register = async (req, res) => {
  console.log("🔥 REGISTER CONTROLLER HIT");

  try {
    console.log("📦 REGISTER BODY:", req.body);
    console.log("⏳ CALLING REGISTER SERVICE...");

    const user = await registerUser(req.body);

    console.log("✅ REGISTER SERVICE COMPLETED");

    return res.status(201).json({
      success: true,
      message: "✔️User registered successfully",
      user,
    });
  } catch (error) {
    console.error("❌ REGISTER CONTROLLER ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to register user",
    });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    console.log("☑️ User logged in:", result.user.mobile);

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

// get current authenticated user
export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user",
    user: req.user,
  });
};

// farmer authentication
export const farmerTest = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Farmer authorization successful",
    user: req.user,
  });
};

// forgot password
export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordUser(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
      resetToken: result.resetToken,
    });
  } catch (error) {
    console.error("Forgot password controller error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message || "Unable to process password reset request",
    });
  }
};

// reset password
export const resetPasswordController = async (req, res) => {
  try {
    const result = await resetPassword(req.body);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Reset password controller error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to reset password",
    });
  }
};