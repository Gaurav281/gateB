import { google } from "googleapis";
import path from "path";
import fs from "fs";

let credentials;

/**
 * Load Google Service Account credentials
 * - Production (Render): from ENV
 * - Local development: from JSON file
 */
if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  } catch (err) {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT JSON");
  }
} else {
  // Local fallback (DO NOT use in production)
  const keyPath = path.join(
    process.cwd(),
    "drive-service-account.json"
  );

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      "drive-service-account.json not found and GOOGLE_SERVICE_ACCOUNT env is missing"
    );
  }

  credentials = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
}

/**
 * Google Auth using Service Account
 */
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

/**
 * Google Drive instance
 */
export const drive = google.drive({
  version: "v3",
  auth,
});

/**
 * Generate secure Google Drive download link
 * (File must be shared with service account email)
 */
export const getDriveFileLink = async (fileId) => {
  if (!fileId) {
    throw new Error("Drive file ID missing");
  }

  // Direct access link (service account has permission)
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
