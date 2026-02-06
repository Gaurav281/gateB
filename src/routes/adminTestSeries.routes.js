import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import {
  createTestSeriesPack,
  getAllTestSeriesPacks,
} from "../controllers/adminTestSeries.controller.js";

const router = express.Router();

router.post("/test-series-pack", authMiddleware , adminMiddleware, createTestSeriesPack);
router.get("/test-series-pack", authMiddleware , adminMiddleware , getAllTestSeriesPacks);

export default router;

