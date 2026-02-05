import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

/* ---------------- Start Server ---------------- */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
