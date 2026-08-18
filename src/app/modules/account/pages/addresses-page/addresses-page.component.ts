import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { AddressResponse, GovernorateResponse } from '../../../../core/models';
import { AddressApiService } from '../../../../core/services/api/address-api.service';
import { GeoApiService } from '../../../../core/services/api/geo-api.service';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { ToastService } from '../../../../core/services/toast.service';

const MAX_ADDRESSES = 10;

@Component({
  selector: 'app-addresses-page',
  templateUrl: './addresses-page.component.html',
  styleUrl: './addresses-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressesPageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly addressApi = inject(AddressApiService);
  private readonly geoApi = inject(GeoApiService);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  readonly addresses = signal<AddressResponse[]>([]);
  readonly governorates = signal<GovernorateResponse[]>([]);
  readonly loading = signal(true);

  readonly dialogOpen = signal(false);
  readonly editingAddress = signal<AddressResponse | null>(null);

  readonly maxAddresses = MAX_ADDRESSES;
  readonly canAddMore = computed(() => this.addresses().length < MAX_ADDRESSES);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
      return;
    }
    this.fetchAll();
  }

  openAdd(): void {
    if (!this.canAddMore()) {
      return;
    }
    this.editingAddress.set(null);
    this.dialogOpen.set(true);
  }

  openEdit(address: AddressResponse): void {
    this.editingAddress.set(address);
    this.dialogOpen.set(true);
  }

  onDialogClosed(): void {
    this.dialogOpen.set(false);
  }

  onDialogSaved(): void {
    this.dialogOpen.set(false);
    this.toast.success(this.translate.instant('account.addresses.savedToast'));
    this.fetchAddresses();
  }

  onDelete(address: AddressResponse): void {
    this.confirmDialogService
      .confirm({
        title: this.translate.instant('account.addresses.confirmDeleteTitle'),
        message: this.translate.instant('account.addresses.confirmDeleteMessage'),
        confirmLabel: this.translate.instant('account.addresses.delete'),
        cancelLabel: this.translate.instant('common.cancel'),
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.addressApi.remove(address.id).subscribe(() => {
          this.toast.success(this.translate.instant('account.addresses.deletedToast'));
          this.fetchAddresses();
        });
      });
  }

  onSetDefault(address: AddressResponse): void {
    this.addressApi.setDefault(address.id).subscribe(() => {
      this.toast.success(this.translate.instant('account.addresses.defaultUpdatedToast'));
      this.fetchAddresses();
    });
  }

  private fetchAll(): void {
    this.loading.set(true);
    forkJoin({
      addresses: this.addressApi.list(),
      governorates: this.geoApi.getGovernorates(),
    }).subscribe({
      next: ({ addresses, governorates }) => {
        this.addresses.set(addresses);
        this.governorates.set(governorates);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private fetchAddresses(): void {
    this.addressApi.list().subscribe((addresses) => this.addresses.set(addresses));
  }
}
