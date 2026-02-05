import admin from "firebase-admin";
import { env } from "./env.js";

/* ---------- Initialize Firebase Admin ---------- */
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.firebase.projectId,
    clientEmail: env.firebase.clientEmail,
    privateKey: env.firebase.privateKey,
  }),
  storageBucket: env.firebase.storageBucket,
});

export const firebaseAuth = admin.auth();
export const storage = admin.storage().bucket();

/* ---------- Generate Signed PDF URL ---------- */
export const generateSignedUrl = async (filePath) => {
  const file = storage.file(filePath);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  return url;
};

