import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

/* ---------------- Global Middleware ---------------- */
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(morgan("dev"));

/* ---------------- Health Check ---------------- */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

/* ---------------- Routes ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- 404 Handler ---------------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ---------------- Global Error Handler ---------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
