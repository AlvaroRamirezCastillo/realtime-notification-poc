import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { NotificationToast } from './notification-toast/notification-toast';
import { RealtimeNotificationService } from './realtime-notification.service';

@Component({
  imports: [JsonPipe, NotificationToast],
  providers: [RealtimeNotificationService],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly realtime = inject(RealtimeNotificationService);
  protected readonly toasts = signal<{ id: string; message: string }[]>([]);
  private readonly shownIds = new Set<string>();
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    effect(() => {
      const notifications = this.realtime.notifications();
      if (!notifications.length) {
        this.shownIds.clear();
        for (const id of this.timers.keys()) this.dismissToast(id);
      }
      for (const notification of notifications) {
        if (this.shownIds.has(notification.id)) continue;
        this.shownIds.add(notification.id);
        if (!notification.isNew) continue;

        const message = notification.data?.message;
        this.toasts.update((items) =>
          [
            ...items,
            {
              id: notification.id,
              message:
                typeof message === 'string' && message.trim()
                  ? message
                  : 'Has recibido una nueva notificación.',
            },
          ].slice(-3),
        );
        this.timers.set(
          notification.id,
          setTimeout(() => this.dismissToast(notification.id), 6000),
        );
      }
    });

    inject(DestroyRef).onDestroy(() => {
      for (const timer of this.timers.values()) clearTimeout(timer);
      this.timers.clear();
    });
  }

  ngOnInit(): void {
    this.realtime.connect();
  }

  protected dismissToast(id: string): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this.toasts.update((items) => items.filter((item) => item.id !== id));
  }
}
