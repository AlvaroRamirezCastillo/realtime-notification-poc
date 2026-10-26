import express from 'express';
import { getFirebaseAdminApp } from './config/firebase-admin.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}

getFirebaseAdminApp();

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'server-poc' });
});

app.listen(port, () => {
  console.log(`server-poc disponible en http://localhost:${port}`);
});
