import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';

const COLLAPSE_STORAGE_KEY = 'admin_sidebar_collapsed';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  // Always starts expanded — both the server-rendered markup and the client's first
  // paint must show the full 264px sidebar. Any stored preference is applied afterward
  // in ngOnInit, never as the initial value, so there's no path where the sidebar can
  // render collapsed before the user has ever touched the toggle.
  readonly sidebarCollapsed = signal(false);
  readonly mobileNavOpen = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      if (localStorage.getItem(COLLAPSE_STORAGE_KEY) === '1') {
        this.sidebarCollapsed.set(true);
      }
    } catch {
      // Storage access can throw in locked-down browser contexts (e.g. private
      // browsing) — falling back to the expanded default is the safe behaviour.
    }
  }

  toggleSidebarCollapsed(): void {
    const next = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(next);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // Ignore — persistence is a nicety, not a requirement.
      }
    }
  }
}
