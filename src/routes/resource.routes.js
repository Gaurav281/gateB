import express from "express";
import {
  getAllResources,
  getResourceById,
  accessResource,
} from "../controllers/resource.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/* Public */
router.get("/", getAllResources);
router.get("/:id", getResourceById);

/* Protected: access purchased resource */
router.get("/:id/access", authMiddleware, accessResource);

export default router;
