import { getDriveFileLink } from "../utils/drive.js";
import Resource from "../models/Resource.js";


export const getAllResources = async (req, res) => {
  const resources = await Resource.find({ isActive: true }).select("-filePath");
  res.status(200).json(resources);
};

export const getResourceById = async (req, res) => {
  const resource = await Resource.findById(req.params.id).select("-filePath");

  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }

  res.status(200).json(resource);
};

export const accessResource = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  // Check purchase
  if (!user.purchasedResources.includes(id)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const resource = await Resource.findById(id);

  if (!resource) {
    return res.status(404).json({ message: "Resource not found" });
  }

  const downloadLink = await getDriveFileLink(resource.driveFileId);

  res.status(200).json({
    url: downloadLink,
  });
};

