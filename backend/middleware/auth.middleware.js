import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

// role-based authorization
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // ensure authentication middleware ran first
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // check whether user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Access denied", 403));
    }

    next();
  };
};

export default protect;