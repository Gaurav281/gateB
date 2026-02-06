import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gatepreppro/screenshots",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadScreenshot = multer({ storage });

export default uploadScreenshot;
