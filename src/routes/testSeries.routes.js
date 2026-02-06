import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import checkTestAccess from "../middleware/checkTestAccess.js";

import {
  getTestsByPack,
  getTestDetails,
  getTestQuestions,
  submitTest,
  getTestResult,
} from "../controllers/testSeries.controller.js";

const router = express.Router();

/* =====================================================
   GET ALL TESTS IN A PACK
   GET /api/test-series/pack/:packId
===================================================== */
router.get(
  "/pack/:packId",
  authMiddleware,
  getTestsByPack
);

/* =====================================================
   GET TEST DETAILS (INSTRUCTIONS PAGE)
   GET /api/test-series/test/:testId
===================================================== */
router.get(
  "/test/:testId",
  authMiddleware,
  checkTestAccess,
  getTestDetails
);

/* =====================================================
   GET QUESTIONS FOR TEST
   GET /api/test-series/test/:testId/questions
===================================================== */
router.get(
  "/test/:testId/questions",
  authMiddleware,
  checkTestAccess,
  getTestQuestions
);

/* =====================================================
   SUBMIT TEST
   POST /api/test-series/test/:testId/submit
===================================================== */
router.post(
  "/test/:testId/submit",
  authMiddleware,
  checkTestAccess,
  submitTest
);

/* =====================================================
   GET TEST RESULT
   GET /api/test-series/test/:testId/result
===================================================== */
router.get(
  "/test/:testId/result",
  authMiddleware,
  checkTestAccess,
  getTestResult
);

export default router;
