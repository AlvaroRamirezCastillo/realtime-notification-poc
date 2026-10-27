import { inject, Service, signal } from '@angular/core';
import {
  getDatabase,
  onChildAdded,
  query,
  ref,
} from 'firebase/database';
import { FirebaseService } from './firebase-service';
import { HttpClient } from '@angular/common/http';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

@Service({ autoProvided: false })
export class RealtimeNotificationService {
  private readonly http = inject(HttpClient);
  private readonly app = inject(FirebaseService).app;
  private readonly auth = getAuth(this.app);
  private readonly database = getDatabase(this.app);
  readonly notifications = signal<{ id: string; data: any; isNew: boolean }[]>([]);

  connect(): void {
    this.http
      .post<{ firebaseToken: string }>('http://localhost:3000/api/realtime/token', {})
      .subscribe({
        next: async ({ firebaseToken }) => {
          await signInWithCustomToken(this.auth, firebaseToken);
          this.listen();
        },
      });
  }

  private listen(): void {
    const uid = this.auth.currentUser?.uid;
    const notificationsQuery = query(
      ref(this.database, `/notifications/${uid}`),
    );

    onChildAdded(
      notificationsQuery,
      (snapshot) => {
        const id = snapshot.key;
        const notification: any = { id, data: snapshot.val(), isNew: true };
        this.notifications.update((items) => ([...items, notification]));
      },
    )
  }
}
