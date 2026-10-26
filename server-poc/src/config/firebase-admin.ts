import {
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
  type App,
} from 'firebase-admin/app';

export function getFirebaseAdminApp(): App {
  if (getApps().some((app) => app.name === '[DEFAULT]')) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const databaseURL = process.env.FIREBASE_DATABASE_URL?.trim();

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID es una variable de entorno obligatoria.');
  }

  if (!databaseURL) {
    throw new Error('FIREBASE_DATABASE_URL es una variable de entorno obligatoria.');
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId,
    databaseURL,
  });
}
