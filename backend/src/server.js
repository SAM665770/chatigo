import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";

const app = express();
const __dirname = path.resolve(); // gives the absolute path of the cwd

const PORT = ENV.PORT || 3000;

app.use(express.json()); // req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
// In development, you typically run your frontend and backend separately (frontend on one port, backend on another)
// In production, you want to serve everything from a single server - the backend serves both API routes and the frontend files
// The dist folder contains the optimized, built version of your frontend application

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
