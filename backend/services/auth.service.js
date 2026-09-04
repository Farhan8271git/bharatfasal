import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// register new user
export const registerUser = async ({
  role,
  name,
  mobile,
  email,
  village,
  district,
  state,
  password,
  termsAccepted,
}) => {
  // normalize input
  const normalizedRole = String(role || "").trim().toLowerCase();
  const normalizedName = String(name || "").trim();
  const normalizedMobile = String(mobile || "").trim();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedVillage = String(village || "").trim();
  const normalizedDistrict = String(district || "").trim();
  const normalizedState = String(state || "").trim();

  // required field validation
  if (
    !normalizedRole ||
    !normalizedName ||
    !normalizedMobile ||
    !normalizedVillage ||
    !normalizedDistrict ||
    !normalizedState ||
    !password
  ) {
    const error = new Error("All required fields must be provided");
    error.statusCode = 400;
    throw error;
  }

  // validate role
  const allowedRoles = ["farmer", "fpo", "buyer"];

  if (!allowedRoles.includes(normalizedRole)) {
    const error = new Error("Invalid user role");
    error.statusCode = 400;
    throw error;
  }

  // validate mobile number
  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    const error = new Error("Invalid mobile number");
    error.statusCode = 400;
    throw error;
  }

  // validate password
  if (password.length < 6) {
    const error = new Error(
      "Password must be at least 6 characters"
    );
    error.statusCode = 400;
    throw error;
  }

  // terms must be accepted
  if (termsAccepted !== true) {
    const error = new Error(
      "Terms and Conditions must be accepted"
    );
    error.statusCode = 400;
    throw error;
  }

  // optional email validation
  if (
    normalizedEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    const error = new Error("Invalid email address");
    error.statusCode = 400;
    throw error;
  }

  // check existing mobile
  const existingMobile = await User.findOne({
    mobile: normalizedMobile,
  });

  if (existingMobile) {
    const error = new Error(
      "An account with this mobile number already exists"
    );
    error.statusCode = 409;
    throw error;
  }

  // check existing email only when provided
  if (normalizedEmail) {
    const existingEmail = await User.findOne({
      email: normalizedEmail,
    });

    if (existingEmail) {
      const error = new Error(
        "An account with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  // hash password before storing
  const passwordHash = await bcrypt.hash(password, 12);

  // create user
  const user = await User.create({
    role: normalizedRole,
    name: normalizedName,
    mobile: normalizedMobile,
    ...(normalizedEmail && {
      email: normalizedEmail,
    }),
    village: normalizedVillage,
    district: normalizedDistrict,
    state: normalizedState,
    passwordHash,
    termsAccepted: true,
  });

  return user;
};

// login existing user
export const loginUser = async ({ mobile, password }) => {
  // normalize input
  const normalizedMobile = String(mobile || "").trim();

  // required field validation
  if (!normalizedMobile || !password) {
    const error = new Error("Mobile number and password are required");
    error.statusCode = 400;
    throw error;
  }

  // validate mobile number
  if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
    const error = new Error("Invalid mobile number");
    error.statusCode = 400;
    throw error;
  }

  // find user by mobile
  const user = await User.findOne({
    mobile: normalizedMobile,
  });

  // avoid account enumeration
  if (!user) {
    const error = new Error("Invalid mobile number or password");
    error.statusCode = 401;
    throw error;
  }

  // compare password with stored hash
  const passwordMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatch) {
    const error = new Error("Invalid mobile number or password");
    error.statusCode = 401;
    throw error;
  }

  // generate access token
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

  // return safe user data
  return {
    token,
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      mobile: user.mobile,
      email: user.email || null,
      village: user.village,
      district: user.district,
      state: user.state,
      termsAccepted: user.termsAccepted,
    },
  };
};