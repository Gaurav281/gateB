import express from "express";
import {
  addResource,
  getAllPurchases,
  getAllUsers,
  approvePurchase,
  rejectPurchase,
  deletePurchaseScreenshot,
  updateResource,
  getAdminStats,
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.put(
  "/resource/:id",
  authMiddleware,
  adminMiddleware,
  updateResource
);

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getAdminStats
);


router.delete(
  "/purchase/:id/screenshot",
  authMiddleware,
  adminMiddleware,
  deletePurchaseScreenshot
);


/* =======================
   RESOURCE MANAGEMENT
======================= */
router.post(
  "/resource",
  authMiddleware,
  adminMiddleware,
  addResource
);

/* =======================
   PURCHASE MANAGEMENT
======================= */
router.get(
  "/purchases",
  authMiddleware,
  adminMiddleware,
  getAllPurchases
);

router.post(
  "/purchase/:purchaseId/approve",
  authMiddleware,
  adminMiddleware,
  approvePurchase
);

router.post(
  "/purchase/:purchaseId/reject",
  authMiddleware,
  adminMiddleware,
  rejectPurchase
);

/* =======================
   USER MANAGEMENT
======================= */
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

export default router;
