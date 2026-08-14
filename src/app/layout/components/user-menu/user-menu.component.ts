import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Popover } from 'primeng/popover';

import { AuthApiService } from '../../../core/services/api/auth-api.service';
import { TokenStorageService } from '../../../core/services/token-storage.service';
import { AuthStoreService } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  private readonly authStore = inject(AuthStoreService);
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly router = inject(Router);

  @ViewChild('panel') private readonly panel!: Popover;

  readonly isLoggedIn = this.authStore.isLoggedIn;
  readonly user = this.authStore.user;

  toggle(event: Event): void {
    this.panel.toggle(event);
  }

  logout(): void {
    this.panel.hide();
    const refreshToken = this.tokenStorage.getRefreshToken();
    // The session is cleared client-side regardless of whether the server call succeeds —
    // an expired/unreachable refresh token shouldn't be able to strand the user logged in.
    const finish = () => {
      this.authStore.clear();
      this.router.navigateByUrl('/');
    };
    if (!refreshToken) {
      finish();
      return;
    }
    this.authApi.logout(refreshToken).subscribe({ next: finish, error: finish });
  }
}
