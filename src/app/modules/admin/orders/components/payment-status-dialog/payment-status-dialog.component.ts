import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { PaymentStatus } from '../../../../../core/enums/payment-status';
import { Language } from '../../../../../core/enums/language';
import { PAYMENT_STATUS_LABELS_AR, PAYMENT_STATUS_LABELS_EN, PAYMENT_TRANSITIONS } from '../../../../../core/constants/order-status.constants';
import { AdminOrderApiService } from '../../../../../core/services/api/admin-order-api.service';
import { LanguageStoreService } from '../../../../../core/state/language-store.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { DialogPortalBase } from '../../../../../shared/base/dialog-portal.base';
import { handleAdminMutationError } from '../../../../../shared/utils/admin-mutation-error.util';

@Component({
  selector: 'app-payment-status-dialog',
  templateUrl: './payment-status-dialog.component.html',
  styleUrl: './payment-status-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentStatusDialogComponent extends DialogPortalBase implements OnChanges {
  private readonly orderApi = inject(AdminOrderApiService);
  private readonly languageStore = inject(LanguageStoreService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  @Input() orderId: number | null = null;
  @Input() currentStatus: PaymentStatus | null = null;

  @Output() readonly closed = new EventEmitter<void>();
  @Output() readonly updated = new EventEmitter<void>();
  @Output() readonly conflict = new EventEmitter<void>();

  readonly selectedStatus = signal<PaymentStatus | null>(null);
  readonly note = signal('');
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly options = computed(() => {
    if (!this.currentStatus) {
      return [];
    }
    const labels = this.languageStore.lang() === Language.AR ? PAYMENT_STATUS_LABELS_AR : PAYMENT_STATUS_LABELS_EN;
    return (PAYMENT_TRANSITIONS[this.currentStatus] ?? []).map((status) => ({ status, label: labels[status] }));
  });

  get open(): boolean {
    return this.orderId !== null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!('orderId' in changes)) {
      return;
    }
    if (this.open) {
      this.selectedStatus.set(null);
      this.note.set('');
      this.saving.set(false);
      this.errorMessage.set(null);
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  cancel(): void {
    if (this.saving()) {
      return;
    }
    this.closed.emit();
  }

  submit(): void {
    const status = this.selectedStatus();
    if (this.saving() || this.orderId === null || !status) {
      return;
    }
    this.saving.set(true);
    this.errorMessage.set(null);
    const lang = this.languageStore.lang() === Language.AR ? Language.AR : Language.EN;
    const labels = lang === Language.AR ? PAYMENT_STATUS_LABELS_AR : PAYMENT_STATUS_LABELS_EN;

    this.orderApi.setPayment(this.orderId, status, this.note().trim() || undefined).subscribe({
      next: () => {
        this.saving.set(false);
        this.toast.success(this.translate.instant('toast.orders.paymentChanged', { status: labels[status] }));
        this.updated.emit();
      },
      error: (err: unknown) => {
        this.saving.set(false);
        const result = handleAdminMutationError(err, this.toast, lang);
        if (result.isConflict) {
          this.errorMessage.set(result.message);
          this.conflict.emit();
        } else if (result.fieldError) {
          this.errorMessage.set(result.fieldError);
        }
      },
    });
  }
}
