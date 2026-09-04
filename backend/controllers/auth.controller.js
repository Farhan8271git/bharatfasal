import { registerUser, loginUser } from "../services/auth.service.js";

// register user
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "✔️User registered successfully",
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
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user: req.user,
  });
};