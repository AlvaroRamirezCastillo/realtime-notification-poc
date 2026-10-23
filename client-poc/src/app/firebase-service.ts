import { Service } from '@angular/core';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { firebaseConfig } from './firebase.config';

@Service()
export class FirebaseService {
  readonly app: FirebaseApp = getApps().some((app) => app.name === '[DEFAULT]')
    ? getApp()
    : initializeApp(firebaseConfig);
}
