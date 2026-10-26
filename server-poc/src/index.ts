import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from './config/firebase-admin.js';

const app = express();
const port = 3000;

const firebaseApp = getFirebaseAdminApp();

app.use(express.json());

app.post('/api/realtime/token', async (_req, res) => {
  const userId = 'user-123';

  const firebaseToken = await getAuth(firebaseApp).createCustomToken(userId);
  res.status(200).json({ firebaseToken });
});

app.listen(port, () => {
  console.log(`server-poc disponible en http://localhost:${port}`);
});
