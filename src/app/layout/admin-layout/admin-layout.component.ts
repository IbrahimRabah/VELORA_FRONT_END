import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, signal } from '@angular/core';

const COLLAPSE_STORAGE_KEY = 'admin_sidebar_collapsed';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {
  private readonly platformId = inject(PLATFORM_ID);

  readonly sidebarCollapsed = signal(
    isPlatformBrowser(this.platformId) && localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1',
  );
  readonly mobileNavOpen = signal(false);

  toggleSidebarCollapsed(): void {
    const next = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(next);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
    }
  }
}
