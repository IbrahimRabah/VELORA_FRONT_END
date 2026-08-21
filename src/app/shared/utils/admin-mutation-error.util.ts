import { HttpErrorResponse } from '@angular/common/http';

import { ERROR_MESSAGES_AR, ERROR_MESSAGES_EN } from '../../core/constants/error-messages';
import { ErrorCode } from '../../core/enums/error-code';
import { Language } from '../../core/enums/language';
import { isApiError } from '../../core/models';
import { ValidationFailedError } from '../../core/interceptors/error.interceptor';
import { ToastService } from '../../core/services/toast.service';

export interface AdminMutationErrorResult {
  // 409 INVALID_STATUS_TRANSITION — the order moved since the page loaded. Never a toast:
  // show `message` inline and refetch the order/list.
  isConflict: boolean;
  message: string | null;
  // 400 VALIDATION_FAILED targeting the reason/note field specifically. Never a toast:
  // bind under the field.
  fieldError: string | null;
}

/**
 * Central error handling for the four admin order mutations (confirm, setFulfillment,
 * setPayment, cancel) — all four suppress the interceptor's automatic toast (see
 * AdminOrderApiService) so this can apply the two documented exceptions:
 *   - 409 INVALID_STATUS_TRANSITION → never a toast (caller shows it inline + refetches)
 *   - 400 VALIDATION_FAILED → never a toast (caller binds fieldError under the field)
 * Every other failure is toasted here, exactly like the interceptor would have — callers
 * don't need to do anything further for the generic case.
 */
export function handleAdminMutationError(err: unknown, toast: ToastService, lang: Language): AdminMutationErrorResult {
  const table = lang === Language.AR ? ERROR_MESSAGES_AR : ERROR_MESSAGES_EN;

  if (err && typeof err === 'object' && (err as Partial<ValidationFailedError>).kind === 'VALIDATION_FAILED') {
    const validationError = err as ValidationFailedError;
    const fieldError = validationError.fieldErrors[0]?.message || validationError.message;
    return { isConflict: false, message: null, fieldError };
  }

  if (err instanceof HttpErrorResponse) {
    const apiError = isApiError(err.error) ? err.error : undefined;

    if (err.status === 409 && apiError?.code === ErrorCode.INVALID_STATUS_TRANSITION) {
      return { isConflict: true, message: table[ErrorCode.INVALID_STATUS_TRANSITION], fieldError: null };
    }

    toast.error(apiError?.code ? table[apiError.code] : table[ErrorCode.INTERNAL_ERROR]);
    return { isConflict: false, message: null, fieldError: null };
  }

  toast.error(table[ErrorCode.INTERNAL_ERROR]);
  return { isConflict: false, message: null, fieldError: null };
}
