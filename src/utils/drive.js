import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), "drive-service-account.json"),
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

/**
 * Generate secure Google Drive download link
 * (file must be shared with service account)
 */
export const getDriveFileLink = async (fileId) => {
  if (!fileId) {
    throw new Error("Drive file ID missing");
  }

  // Direct download link (works only because SA has access)
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};
