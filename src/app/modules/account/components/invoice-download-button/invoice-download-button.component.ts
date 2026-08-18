import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, PLATFORM_ID, inject, signal } from '@angular/core';

import { downloadBlob } from '../../../../core/services/file-download.util';
import { OrderApiService } from '../../../../core/services/api/order-api.service';

@Component({
  selector: 'app-invoice-download-button',
  templateUrl: './invoice-download-button.component.html',
  styleUrl: './invoice-download-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceDownloadButtonComponent {
  private readonly orderApi = inject(OrderApiService);
  private readonly platformId = inject(PLATFORM_ID);

  @Input({ required: true }) invoiceNumber!: string;

  readonly downloading = signal(false);

  download(): void {
    if (!isPlatformBrowser(this.platformId) || this.downloading()) {
      return;
    }
    this.downloading.set(true);
    this.orderApi.downloadInvoice(this.invoiceNumber).subscribe({
      next: (blob) => {
        downloadBlob(blob, `${this.invoiceNumber}.pdf`, this.platformId);
        this.downloading.set(false);
      },
      error: () => this.downloading.set(false),
    });
  }
}
