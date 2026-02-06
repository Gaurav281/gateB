import express from "express";
import { createWebsitePurchase , getMyPurchases, createPurchase } from "../controllers/purchase.controller.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
// import { uploadScreenshot } from "../middleware/upload.middleware.js";
import uploadScreenshot from "../middleware/uploadScreenshot.js";


const router = express.Router();
/* Get my purchases */
router.get(
  "/my",
  authMiddleware,
  getMyPurchases
);


/* Create purchase request (Telegram bot) */
router.post(
  "/website",
  authMiddleware,
  uploadScreenshot.single("screenshot"),
  createWebsitePurchase
);

router.post("/", createPurchase);


export default router;
