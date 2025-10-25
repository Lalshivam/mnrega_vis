import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";
import biharRoutes from "./routes/bihar.routes.js";
import cron from "node-cron";
import { fetchBiharData } from "./services/dataIngestion.service.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// compute __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// connect to DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend statics in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendPath));
  console.log("📦 Serving frontend from:", frontendPath);
}

// API routes (always mounted at /api)
app.use("/api", biharRoutes);

// Health or SPA entrypoint
if (process.env.NODE_ENV === "production") {
  // Serve index.html for any non-/api route (use RegExp to avoid path-to-regexp string parsing issues)
  const frontendIndex = path.join(__dirname, "..", "frontend", "dist", "index.html");
  app.get(/^\/(?!api).*$/, (req, res) => {
    res.sendFile(frontendIndex);
  });
} else {
  // Development: keep simple health check at root
  app.get("/", (_, res) => res.send("✅ MGNREGA Bihar API running"));
}

// Refresh Bihar data yearly on Jan 1 at 03:00 server time
cron.schedule("0 3 1 1 *", async () => {
  try {
    console.log("🕒 CRON: Refreshing Bihar data (annual run: Jan 1 03:00)...");
    await fetchBiharData("2024-2025");
    console.log("✅ CRON: Annual Bihar data refresh completed");
  } catch (err) {
    console.error("CRON: Annual refresh failed:", err);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`));
