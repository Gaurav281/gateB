import Test from "../models/Test.js";
import Purchase from "../models/Purchase.js";

/**
 * Middleware to check if user has access to a test
 * (User must have purchased the test-series pack)
 */
const checkTestAccess = async (req, res, next) => {
  try {
    const { testId } = req.params;

    if (!testId) {
      return res
        .status(400)
        .json({ message: "Test ID missing" });
    }

    // 1️⃣ Find the test
    const test = await Test.findById(testId).populate("pack");

    if (!test) {
      return res
        .status(404)
        .json({ message: "Test not found" });
    }

    // 2️⃣ Check purchase of the pack
    const purchase = await Purchase.findOne({
      user: req.user._id,
      resource: test.pack._id,
      status: "approved",
    });

    if (!purchase) {
      return res.status(403).json({
        message:
          "You have not purchased this test series pack",
      });
    }

    // 3️⃣ Attach test to request (useful later)
    req.test = test;

    next();
  } catch (err) {
    console.error("checkTestAccess error:", err);
    res
      .status(500)
      .json({ message: "Access check failed" });
  }
};

export default checkTestAccess;
