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
const allowedOrigins = [
  "http://localhost:5173",
  "https://gatepreppro.vercel.app",
  "https://www.gatepreppro.vercel.app",
  "https://gatepreppro.in",
  "https://www.gatepreppro.in",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / Postman / Render health checks
      if (!origin) return callback(null, true);

      // Allow Vercel preview & prod subdomains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      // Reject silently (NO error throw)
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
