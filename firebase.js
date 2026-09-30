const admin = require('firebase-admin');

// Securely load service account credentials via environment variables or a config file
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) 
  : require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL // Realtime Database URL agar use kar rahe hain
  });
}

const db = admin.firestore(); // Firestore Database ke liye
const rtdb = admin.database(); // Realtime Database ke liye
const auth = admin.auth();     // Firebase Auth verification ke liye

module.exports = { admin, db, rtdb, auth };
