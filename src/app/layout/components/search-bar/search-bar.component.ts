import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  @ViewChild('searchInput') private readonly searchInput?: ElementRef<HTMLInputElement>;

  readonly query: FormControl<string> = this.fb.control('');
  readonly isOpen = signal(false);

  openSearch(): void {
    this.isOpen.set(true);
    // The toggle button was itself briefly focused by the click that opened this (the
    // browser's default action for clicking a focusable element), then hidden — and
    // hiding the focused element makes the browser reassign focus to <body>. That
    // reassignment isn't synchronous, so a bare setTimeout(0)/queueMicrotask can still
    // run before it and get silently overridden a tick later (reproduced and confirmed
    // in a real browser: 0ms lost the race, 50ms didn't).
    setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
  }

  closeSearch(): void {
    this.isOpen.set(false);
  }

  submit(): void {
    const q = this.query.value.trim();
    if (!q) {
      return;
    }
    this.router.navigate(['/products'], { queryParams: { q } });
    this.closeSearch();
  }
}
