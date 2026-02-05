import User from "../models/User.js";
import Resource from "../models/Resource.js";
import Purchase from "../models/Purchase.js";
import { sendEmail } from "../utils/mailer.js";
import fs from "fs";
import path from "path";

export const deletePurchaseScreenshot = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await Purchase.findById(id);

    if (!purchase || !purchase.screenshot) {
      return res.status(404).json({
        message: "Screenshot not found",
      });
    }

    // 🔥 FIX: remove leading slash
    const relativePath = purchase.screenshot.startsWith("/")
      ? purchase.screenshot.slice(1)
      : purchase.screenshot;

    const filePath = path.join(process.cwd(), relativePath);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      console.warn("Screenshot file not found on disk:", filePath);
    }

    purchase.screenshot = null;
    await purchase.save();

    res.status(200).json({
      message: "Screenshot deleted successfully",
    });
  } catch (err) {
    console.error("Delete Screenshot Error:", err);
    res.status(500).json({ message: err.message });
  }
};




/* =======================
   ADD NEW RESOURCE
======================= */
export const addResource = async (req, res) => {
  try {
    const { title, description, price, previewImage, driveFileId, discountPercent } = req.body;

    if (!title || !description || !price || !driveFileId) {
      return res.status(400).json({
        message: "Title, description, price and Drive File ID are required",
      });
    }

    const resource = await Resource.create({
      title,
      description,
      price,
      discountPercent: discountPercent || 0,
      previewImage,
      driveFileId,
      type: "pdf",
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Add Resource Error:", err);
    res.status(500).json({
      message: "Failed to add resource",
      error: err.message,
    });
  }
};


/* =======================
   GET ALL PURCHASES
======================= */
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("user", "name email")
      .populate("resource", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

/* =======================
   GET ALL USERS
======================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-googleId");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* =======================
   APPROVE PURCHASE
======================= */
export const approvePurchase = async (req, res) => {
  const { purchaseId } = req.params;

  const purchase = await Purchase.findById(purchaseId);

  if (!purchase || purchase.status !== "pending") {
    return res.status(400).json({ message: "Invalid purchase request" });
  }

  purchase.status = "approved";
  purchase.verifiedBy = req.user._id;
  await purchase.save();

  const user = await User.findById(purchase.user);

  if (!user.purchasedResources.includes(purchase.resource)) {
    user.purchasedResources.push(purchase.resource);
    await user.save();
  }

  await sendEmail({
    to: user.email,
    subject: "Access Granted – GatePrepPro",
    html: `
    <h2>Payment Approved ✅</h2>
    <p>Your payment has been verified.</p>
    <p>You can now access your purchased resource from your profile.</p>
    <br/>
    <p><strong>GatePrepPro Team</strong></p>
  `,
  });


  res.status(200).json({ message: "Purchase approved" });
};

/* =======================
   REJECT PURCHASE
======================= */
export const rejectPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    const purchase = await Purchase.findById(purchaseId);

    if (!purchase || purchase.status !== "pending") {
      return res.status(400).json({ message: "Invalid purchase request" });
    }

    purchase.status = "rejected";
    purchase.verifiedBy = req.user._id;
    await purchase.save();

    // ✅ FETCH USER
    const user = await User.findById(purchase.user);

    await sendEmail({
      to: user.email,
      subject: "Access Denied – GatePrepPro",
      html: `
        <h2>Payment Rejected ❌</h2>
        <p>Your payment could not be verified and has been rejected.</p>
        <p>Please try again or contact support.</p>
        <br/>
        <p><strong>GatePrepPro Team</strong></p>
      `,
    });

    res.status(200).json({ message: "Purchase rejected" });
  } catch (err) {
    console.error("Reject Purchase Error:", err);
    res.status(500).json({ message: err.message });
  }
};



/* UPDATE RESOURCE */
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Resource.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DASHBOARD STATS */
export const getAdminStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const pendingPurchases = await Purchase.countDocuments({
      status: "pending",
    });
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalResources,
      pendingPurchases,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
