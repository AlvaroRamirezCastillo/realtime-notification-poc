import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase, ServerValue } from 'firebase-admin/database';
import { getFirebaseAdminApp } from './config/firebase-admin.js';

const app = express();
const port = 3000;

const firebaseApp = getFirebaseAdminApp();
const userId = 'user-123';

app.use(express.json());

app.post('/api/realtime/token', async (_req, res) => {
  const firebaseToken = await getAuth(firebaseApp).createCustomToken(userId);

  res.status(200).json({ firebaseToken });
});

app.post('/api/realtime/notifications', async (req, res) => {
  const message = req.body?.message;

  const notification = await getDatabase(firebaseApp)
    .ref(`/notifications/${userId}`)
    .push({
      type: 'TEST',
      message: message.trim(),
      createdAt: ServerValue.TIMESTAMP,
    });

  res.status(201).json({ notificationId: notification.key });
});

app.listen(port, () => {
  console.log(`server-poc disponible en http://localhost:${port}`);
});
