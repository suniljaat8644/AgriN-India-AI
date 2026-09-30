const express = require('express');
const cors = require('cors');
const { admin, db, rtdb } = require('./firebase');
const verifyFirebaseToken = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(cors());

// Public Health Check Route
app.get('/', (req, res) => {
  res.send('Backend with Firebase is running successfully!');
});

// Protected Route utilizing Firestore
app.post('/api/data', verifyFirebaseToken, async (req, res) => {
  try {
    const { collectionName, payload } = req.body;
    const userId = req.user.uid;

    const docRef = await db.collection(collectionName).add({
      ...payload,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).json({ success: true, id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
