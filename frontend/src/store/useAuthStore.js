import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfilePic: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      // toast
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out");
      console.log("Error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfilePic: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfilePic: false });
    }
  },

  // SOCKET.IO CLIENT CONNECTION METHOD
  // Establishes real-time connection to server for chat features
  connectSocket: () => {
    // STEP 1: Get current authentication state from Zustand store
    const { authUser } = get();

    // STEP 2: Guard clauses - prevent unnecessary connections
    // Exit if user is not authenticated OR socket is already connected
    if (!authUser || get().socket?.connected) return;

    // STEP 3: Create Socket.IO client instance
    // BASE_URL: Server endpoint (localhost:3000 in dev, "/" in production)
    // withCredentials: true - Sends HTTP-only cookies (including JWT) with connection
    const socket = io(BASE_URL, { withCredentials: true });

    // STEP 4: Explicitly establish the connection
    // This triggers the server's authentication middleware
    socket.connect();

    // STEP 5: Store socket instance in global state
    // Makes socket available throughout the app for sending events
    set({ socket });

    // STEP 6: Set up event listeners for real-time updates
    // Listen for "getOnlineUsers" events from server
    // Server sends this when users connect/disconnect
    socket.on("getOnlineUsers", (userIds) => {
      // Update global state with current online users array
      // userIds is array of user IDs currently connected
      set({ onlineUsers: userIds });
    });

    /*
     * CONNECTION FLOW:
     * 1. User logs in successfully
     * 2. connectSocket() called
     * 3. Socket.IO client connects to server
     * 4. Server validates JWT via socketAuthMiddleware
     * 5. If valid: connection established, user added to online list
     * 6. Server broadcasts updated online users to all clients
     * 7. This client receives "getOnlineUsers" event
     * 8. onlineUsers state updated, UI shows online indicators
     *
     */
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
