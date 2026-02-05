import express from "express";
import { googleAuth, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Google login */
router.post("/google", googleAuth);

/* Get current user */
router.get("/me", authMiddleware, getMe);

export default router;
