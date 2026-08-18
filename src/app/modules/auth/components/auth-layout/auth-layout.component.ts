import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  // Filename (no extension) under assets/images/shared/ — login/forgot/reset all share the
  // default cover; only register points at its own.
  @Input() coverImage = 'login-cover';
}
