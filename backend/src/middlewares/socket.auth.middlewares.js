import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

// Socket.IO authentication middleware function
// Runs before every socket connection is established
export const socketAuthMiddleware = async (socket, next) => {
  try {
    // STEP 1: Extract JWT token from HTTP-only cookies
    // socket.handshake.headers.cookie contains all cookies as a string
    // Format: "cookie1=value1; cookie2=value2; jwt=tokenvalue"
    const token = socket.handshake.headers.cookie
      ?.split("; ") // Split into individual cookie pairs
      .find((row) => row.startsWith("jwt=")) // Find the JWT cookie
      ?.split("=")[1]; // Extract the token value after "jwt="

    // STEP 2: Validate token existence
    if (!token) {
      console.log("Socket connection rejected: No token provided");
      // Call next() with error to reject the socket connection
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // STEP 3: Verify JWT token signature and expiration
    // jwt.verify() throws an error if token is invalid or expired
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // STEP 4: Fetch user from database using decoded user ID
    // .select("-password") excludes password field from the result
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // STEP 5: Attach user information to socket object
    // This makes user data available in all socket event handlers
    socket.user = user; // Full user object (name, email, profilePic, etc.)
    socket.userId = user._id.toString(); // String version of user ID for easy access

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    // STEP 6: Call next() without error to allow the connection
    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};

/*
 * MIDDLEWARE FLOW EXPLANATION:
 * 
 * 1. CLIENT CONNECTION ATTEMPT:
 *    - User's browser attempts to establish Socket.IO connection
 *    - Browser automatically sends cookies (including JWT) in headers
 * 
 * 2. AUTHENTICATION PROCESS:
 *    - Extract JWT from cookie header string
 *    - Verify JWT signature and check expiration
 *    - Look up user in database to ensure they still exist
 *    - Attach user info to socket for future use
 * 
 * 3. CONNECTION RESULT:
 *    - SUCCESS: next() called → connection established → user can send/receive real-time events
 *    - FAILURE: next(error) called → connection rejected → client receives error event
 * 
 * 4. SECURITY BENEFITS:
 *    - Only authenticated users can connect
 *    - Expired or tampered tokens are rejected
 *    - Deleted users cannot maintain connections
 *    - User identity is verified for all real-time events
 * 
 * 5. USAGE IN SOCKET HANDLERS:
 *    - socket.user contains full user object
 *    - socket.userId contains string ID for quick access
 *    - No need to re-authenticate in individual event handlers
 */