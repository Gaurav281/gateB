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






// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBJIIe1y7Cy8TE7lDdkYj-0Kpv1FrNzWCs",
//   authDomain: "gatepreppro.firebaseapp.com",
//   projectId: "gatepreppro",
//   storageBucket: "gatepreppro.firebasestorage.app",
//   messagingSenderId: "44744910525",
//   appId: "1:44744910525:web:6d8f26f1d23be9a6f3b9d4"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
