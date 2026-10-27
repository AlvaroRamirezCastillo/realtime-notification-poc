import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RealtimeNotificationService } from './realtime-notification.service';

@Component({
  imports: [JsonPipe, RouterOutlet],
  providers: [RealtimeNotificationService],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly realtime = inject(RealtimeNotificationService);
}
