import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ERROR_MESSAGES_AR, ERROR_MESSAGES_EN } from '../../../../core/constants/error-messages';
import { ErrorCode } from '../../../../core/enums/error-code';
import { Language } from '../../../../core/enums/language';
import { isApiError } from '../../../../core/models';
import { AuthApiService } from '../../../../core/services/api/auth-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LanguageStoreService } from '../../../../core/state/language-store.service';
import { bindServerFieldErrors, isValidationFailedError } from '../../../../shared/utils/bind-field-errors.util';
import { getFieldErrorKey } from '../../../../shared/utils/field-error-key.util';
import { matchFieldsValidator } from '../../../../shared/validators/match-fields.validator';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);
  private readonly languageStore = inject(LanguageStoreService);

  private readonly token = this.route.snapshot.queryParamMap.get('token');

  readonly linkInvalid = !this.token;

  readonly form = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: matchFieldsValidator('newPassword', 'confirmPassword') },
  );

  readonly loading = signal(false);
  readonly formError = signal<string | null>(null);
  readonly showPassword = signal(false);

  fieldError(name: 'newPassword' | 'confirmPassword'): string | null {
    return getFieldErrorKey(this.form.get(name));
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  submit(): void {
    if (this.loading() || !this.token) {
      return;
    }
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { newPassword } = this.form.getRawValue();
    this.authApi.resetPassword({ token: this.token, newPassword }).subscribe({
      next: () => {
        this.toast.success(this.translate.instant('toast.auth.passwordChanged'));
        void this.router.navigateByUrl('/auth/login');
      },
      error: (err: unknown) => {
        this.loading.set(false);
        if (isValidationFailedError(err)) {
          bindServerFieldErrors(this.form, err.fieldErrors);
          return;
        }
        if (err instanceof HttpErrorResponse && isApiError(err.error)) {
          const code = err.error.code;
          if (code === ErrorCode.TOKEN_INVALID || code === ErrorCode.TOKEN_EXPIRED) {
            this.formError.set(this.errorMessage(code));
          }
        }
      },
    });
  }

  private errorMessage(code: ErrorCode): string {
    const table = this.languageStore.lang() === Language.EN ? ERROR_MESSAGES_EN : ERROR_MESSAGES_AR;
    return table[code];
  }
}
