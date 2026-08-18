import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';

import { FulfillmentStatus } from '../../../../core/enums/fulfillment-status';
import { PaymentStatus } from '../../../../core/enums/payment-status';
import { OrderSummaryResponse } from '../../../../core/models';
import { OrderApiService } from '../../../../core/services/api/order-api.service';
import { LanguageStoreService } from '../../../../core/state/language-store.service';
import { formatOrderDate } from '../../utils/format-order-date.util';
import { fulfillmentStatusLabel, paymentStatusLabel } from '../../utils/order-status-label.util';
import { PillTone, fulfillmentPillTone } from '../../utils/order-status-pill.util';

type TabKey = 'ALL' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const TAB_STATUSES: Record<Exclude<TabKey, 'ALL'>, readonly FulfillmentStatus[]> = {
  PROCESSING: [FulfillmentStatus.PENDING, FulfillmentStatus.CONFIRMED, FulfillmentStatus.PROCESSING],
  SHIPPED: [FulfillmentStatus.SHIPPED, FulfillmentStatus.OUT_FOR_DELIVERY],
  DELIVERED: [FulfillmentStatus.DELIVERED, FulfillmentStatus.RETURNED, FulfillmentStatus.PARTIALLY_RETURNED],
  CANCELLED: [
    FulfillmentStatus.CANCELLED,
    FulfillmentStatus.DELIVERY_FAILED,
    FulfillmentStatus.REFUSED_ON_DELIVERY,
    FulfillmentStatus.RETURNED_TO_SELLER,
  ],
};

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: 'ALL', labelKey: 'account.orders.tabs.all' },
  { key: 'PROCESSING', labelKey: 'account.orders.tabs.processing' },
  { key: 'SHIPPED', labelKey: 'account.orders.tabs.shipped' },
  { key: 'DELIVERED', labelKey: 'account.orders.tabs.delivered' },
  { key: 'CANCELLED', labelKey: 'account.orders.tabs.cancelled' },
];

@Component({
  selector: 'app-orders-page',
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly orderApi = inject(OrderApiService);
  private readonly languageStore = inject(LanguageStoreService);

  readonly tabs = TABS;
  readonly lang = this.languageStore.lang;

  readonly orders = signal<OrderSummaryResponse[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly activeTab = signal<TabKey>('ALL');

  readonly filteredOrders = computed(() => {
    const tab = this.activeTab();
    if (tab === 'ALL') {
      return this.orders();
    }
    const statuses = TAB_STATUSES[tab];
    return this.orders().filter((order) => statuses.includes(order.fulfillmentStatus));
  });

  readonly noOrdersAtAll = computed(() => this.orders().length === 0);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      this.loading.set(false);
      return;
    }
    this.fetch(0);
  }

  setTab(tab: TabKey): void {
    this.activeTab.set(tab);
  }

  onPageChange(page: number): void {
    this.fetch(page);
  }

  retry(): void {
    this.fetch(this.page());
  }

  fulfillmentLabel(status: FulfillmentStatus): string {
    return fulfillmentStatusLabel(status, this.lang());
  }

  paymentLabel(status: PaymentStatus): string {
    return paymentStatusLabel(status, this.lang());
  }

  pillTone(status: FulfillmentStatus): PillTone {
    return fulfillmentPillTone(status);
  }

  formatDate(iso: string): string {
    return formatOrderDate(iso, this.lang());
  }

  private fetch(page: number): void {
    this.loading.set(true);
    this.error.set(false);
    this.orderApi.myOrders(page).subscribe({
      next: (result) => {
        this.orders.set(result.content);
        this.page.set(result.page);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
