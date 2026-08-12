import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';

/**
 * Counts in-flight HTTP requests. loading.interceptor (batch 4) calls show()/hide()
 * around every request; components subscribe to isLoading$ for a global spinner.
 * Silent requests (e.g. background polling) are the interceptor's decision to skip,
 * not this service's — it just counts what it's told to count.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly count = new BehaviorSubject<number>(0);

  readonly isLoading$: Observable<boolean> = this.count.pipe(
    map((value) => value > 0),
    distinctUntilChanged(),
  );

  show(): void {
    this.count.next(this.count.value + 1);
  }

  hide(): void {
    this.count.next(Math.max(0, this.count.value - 1));
  }

  reset(): void {
    this.count.next(0);
  }
}
