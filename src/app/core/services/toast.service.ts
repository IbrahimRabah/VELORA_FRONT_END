import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  severity: ToastSeverity;
  summary?: string;
  detail: string;
  life: number;
}

/**
 * Emits toast events on a stream — presentation (e.g. shared/components/vl-toast-container)
 * subscribes to `messages$` and renders them; this service holds no UI/template concerns.
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly messages = new Subject<ToastMessage>();
  private nextId = 0;

  readonly messages$: Observable<ToastMessage> = this.messages.asObservable();

  success(detail: string, summary?: string, life = 4000): void {
    this.emit('success', detail, summary, life);
  }

  error(detail: string, summary?: string, life = 6000): void {
    this.emit('error', detail, summary, life);
  }

  warning(detail: string, summary?: string, life = 5000): void {
    this.emit('warning', detail, summary, life);
  }

  info(detail: string, summary?: string, life = 4000): void {
    this.emit('info', detail, summary, life);
  }

  private emit(severity: ToastSeverity, detail: string, summary: string | undefined, life: number): void {
    this.messages.next({ id: ++this.nextId, severity, summary, detail, life });
  }
}
