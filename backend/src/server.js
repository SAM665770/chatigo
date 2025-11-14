import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/messages.routes.js"

dotenv.config({
  path: "./.env",
});

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
