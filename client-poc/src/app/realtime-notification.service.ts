import { HttpClient } from '@angular/common/http';
import { inject, OnDestroy, Service, signal } from '@angular/core';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, onChildAdded, onValue, query, ref } from 'firebase/database';
import { Subscription, switchMap } from 'rxjs';
import { FirebaseService } from './firebase-service';

@Service({ autoProvided: false })
export class RealtimeNotificationService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly app = inject(FirebaseService).app;
  private readonly auth = getAuth(this.app);
  private readonly database = getDatabase(this.app);
  private readonly subscriptions = new Subscription();
  private started = false;
  readonly notifications = signal<{ id: string; data: any; isNew: boolean }[]>([]);

  connect(): void {
    if (this.started || this.subscriptions.closed) return;
    this.started = true;
    this.subscriptions.add(
      this.http
        .post<{ firebaseToken: string }>('http://localhost:3000/api/realtime/token', {})
        .pipe(switchMap(({ firebaseToken }) => signInWithCustomToken(this.auth, firebaseToken)))
        .subscribe({
          next: () => this.listen(),
          error: () => {
            this.started = false;
            console.error('No se pudo conectar a las notificaciones de Firebase.');
          },
        }),
    );
  }

  private listen(): void {
    const userId = this.auth.currentUser?.uid;
    if (!userId) {
      this.started = false;
      return;
    }
    const notificationsQuery = query(ref(this.database, `/notifications/${userId}`));
    let initialLoad = true;
    this.subscriptions.add(
      onChildAdded(notificationsQuery, (snapshot) => {
        const id = snapshot.key;
        if (!id || this.subscriptions.closed || this.auth.currentUser?.uid !== userId) return;
        if (this.notifications().some((notification) => notification.id === id)) return;
        const notification = { id, data: snapshot.val(), isNew: !initialLoad };
        this.notifications.update((items) => [...items, notification]);
      }),
    );
    // El primer value marca el final de los child_added del historial inicial.
    this.subscriptions.add(
      onValue(
        notificationsQuery,
        () => {
          initialLoad = false;
        },
        { onlyOnce: true },
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
