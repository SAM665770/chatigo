import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

/**
 * Middleware to protect routes by verifying JWT token
 * Checks for valid JWT token in cookies and attaches user to request object
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Extract JWT token from cookies
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    // Verify the token using JWT secret
    const decodedToken = jwt.verify(token, ENV.JWT_SECRET);
    if (!decodedToken)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });

    // Find user by ID from token payload, excluding password field
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attach user object to request for use in protected routes
    req.user = user;
    next(); // Continue to next middleware/route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal Server Error" }); 
  }
};
