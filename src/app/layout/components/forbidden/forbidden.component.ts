import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthStoreService } from '../../../core/state/auth-store.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent {
  private readonly authStore = inject(AuthStoreService);

  readonly isLoggedIn = this.authStore.isLoggedIn;
}
