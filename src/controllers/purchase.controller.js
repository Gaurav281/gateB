import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import Resource from "../models/Resource.js";


export const createPurchase = async (req, res) => {
  const { email, resourceId, transactionId, screenshotUrl } = req.body;

  const user = await User.findOne({ email });
  const resource = await Resource.findById(resourceId);

  if (!user || !resource) {
    return res.status(404).json({ message: "Invalid user or resource" });
  }

  const purchase = await Purchase.create({
    user: user._id,
    resource: resource._id,
    transactionId,
    screenshotUrl,
  });

  res.status(201).json({
    message: "Purchase request submitted",
    purchaseId: purchase._id,
  });
};



export const createWebsitePurchase = async (req, res) => {
  try {
    const { resourceId } = req.body;

    if (!resourceId || !req.file) {
      return res.status(400).json({
        message: "Screenshot is required for payment verification",
      });
    }


    const screenshotPath = req.file
      ? `/uploads/screenshots/${req.file.filename}`
      : null;

    const purchase = await Purchase.create({
      user: req.user._id,
      resource: resourceId,
      screenshot: screenshotPath,
      status: "pending",
    });

    res.status(201).json({
      message:
        "Payment submitted successfully. You will get access within 10 minutes after verification.",
      purchaseId: purchase._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id })
      .populate("resource", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



