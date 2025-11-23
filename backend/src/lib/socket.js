import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socket.auth.middlewares.js";

const app = express();
// Create an HTTP server instance using the Express app
const server = http.createServer(app);

// Initialize Socket.IO server with the HTTP server
const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL], // Array of allowed origins from environment config
    credentials: true, // Allow credentials like cookies, authorization headers
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// ONLINE USER TRACKING SYSTEM
// Map to store currently connected users: {userId: socketId}
// This allows us to track who's online and send targeted messages
const userSocketMap = {}; // Example: {"user123": "socket456", "user789": "socket012"}

// MAIN CONNECTION HANDLER
// This event fires when a client successfully connects (after authentication)

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  // STEP 1: Register user as online
  // Extract user ID from socket (set by authentication middleware)
  const userId = socket.userId;
  // Store mapping of user ID to their current socket ID
  userSocketMap[userId] = socket.id;

  // STEP 2: Broadcast updated online users list to ALL connected clients
  // Object.keys(userSocketMap) gives array of all online user IDs
  // io.emit() sends to ALL connected clients (broadcast)
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // STEP 3: Handle user disconnection
  // Listen for when this specific socket disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);

    // Remove user from online users map
    delete userSocketMap[userId];

    // Broadcast updated online users list (without the disconnected user)
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
