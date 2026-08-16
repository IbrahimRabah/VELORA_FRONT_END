import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, pairwise, startWith } from 'rxjs';

// Angular's own `scrollPositionRestoration: 'top'` (see app-routing.module.ts, now
// 'disabled') scrolls to (0,0) on every NavigationEnd, including query-param-only
// updates that stay on the same route — jarring on the product list page, where
// picking a filter, sorting, or swapping category (all `router.navigate([], {
// queryParams }))` calls) reset scroll back to the top of the page mid-browse. This
// only scrolls to top when the path itself actually changes; same-path query updates
// leave the user's scroll position alone.
@Injectable({
  providedIn: 'root',
})
export class ScrollRestorationService {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects.split('?')[0]),
        startWith(this.router.url.split('?')[0]),
        pairwise(),
      )
      .subscribe(([previousPath, currentPath]) => {
        if (previousPath !== currentPath) {
          window.scrollTo({ top: 0 });
        }
      });
  }
}
