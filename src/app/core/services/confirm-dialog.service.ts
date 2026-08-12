import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

export interface ConfirmDialogRequest extends ConfirmDialogOptions {
  id: number;
}

/**
 * Presentation-agnostic: this service only carries the request/answer plumbing.
 * shared/components/vl-confirm-dialog (or any host component) subscribes to `requests$`,
 * shows a dialog, and calls resolve(id, true|false) once the user answers.
 */
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly requests = new Subject<ConfirmDialogRequest>();
  private readonly pending = new Map<number, Subject<boolean>>();
  private nextId = 0;

  readonly requests$: Observable<ConfirmDialogRequest> = this.requests.asObservable();

  confirm(options: ConfirmDialogOptions): Observable<boolean> {
    const id = ++this.nextId;
    const answer = new Subject<boolean>();
    this.pending.set(id, answer);
    this.requests.next({ id, ...options });
    return answer.asObservable();
  }

  resolve(id: number, confirmed: boolean): void {
    const answer = this.pending.get(id);
    if (!answer) {
      return;
    }
    answer.next(confirmed);
    answer.complete();
    this.pending.delete(id);
  }
}
