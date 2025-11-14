import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/messages.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const __dirname = path.resolve(); // gives the absolute path of the cwd

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.use((_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
// In development, you typically run your frontend and backend separately (frontend on one port, backend on another)
// In production, you want to serve everything from a single server - the backend serves both API routes and the frontend files
// The dist folder contains the optimized, built version of your frontend application

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
