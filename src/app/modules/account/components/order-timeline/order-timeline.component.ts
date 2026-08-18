import { ChangeDetectionStrategy, Component, Input, computed, inject, signal } from '@angular/core';

import { FulfillmentStatus } from '../../../../core/enums/fulfillment-status';
import { PaymentStatus } from '../../../../core/enums/payment-status';
import { Language } from '../../../../core/enums/language';
import { OrderTimelineEntry } from '../../../../core/models';
import { LanguageStoreService } from '../../../../core/state/language-store.service';
import { formatOrderDate } from '../../utils/format-order-date.util';
import { fulfillmentStatusLabel, paymentStatusLabel } from '../../utils/order-status-label.util';

const FULFILLMENT_ICONS: Record<FulfillmentStatus, string> = {
  [FulfillmentStatus.PENDING]: 'pi-clock',
  [FulfillmentStatus.CONFIRMED]: 'pi-check',
  [FulfillmentStatus.PROCESSING]: 'pi-cog',
  [FulfillmentStatus.SHIPPED]: 'pi-send',
  [FulfillmentStatus.OUT_FOR_DELIVERY]: 'pi-map-marker',
  [FulfillmentStatus.DELIVERED]: 'pi-check-circle',
  [FulfillmentStatus.DELIVERY_FAILED]: 'pi-exclamation-triangle',
  [FulfillmentStatus.REFUSED_ON_DELIVERY]: 'pi-exclamation-triangle',
  [FulfillmentStatus.RETURNED_TO_SELLER]: 'pi-replay',
  [FulfillmentStatus.CANCELLED]: 'pi-times-circle',
  [FulfillmentStatus.RETURNED]: 'pi-replay',
  [FulfillmentStatus.PARTIALLY_RETURNED]: 'pi-replay',
};

const PAYMENT_ICONS: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'pi-wallet',
  [PaymentStatus.AUTHORIZED]: 'pi-shield',
  [PaymentStatus.PAID]: 'pi-check',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'pi-replay',
  [PaymentStatus.REFUNDED]: 'pi-replay',
  [PaymentStatus.FAILED]: 'pi-times',
  [PaymentStatus.EXPIRED]: 'pi-times',
};

interface TimelineNode {
  readonly entry: OrderTimelineEntry;
  readonly isPayment: boolean;
  readonly icon: string;
  readonly label: string;
  readonly date: string;
}

@Component({
  selector: 'app-order-timeline',
  templateUrl: './order-timeline.component.html',
  styleUrl: './order-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTimelineComponent {
  private readonly languageStore = inject(LanguageStoreService);

  private readonly entriesSignal = signal<OrderTimelineEntry[]>([]);

  @Input({ required: true })
  set entries(value: OrderTimelineEntry[]) {
    this.entriesSignal.set(value);
  }

  readonly nodes = computed<TimelineNode[]>(() => {
    const lang = this.languageStore.lang();
    return [...this.entriesSignal()]
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
      .map((entry) => this.toNode(entry, lang));
  });

  readonly currentIndex = computed(() => this.nodes().length - 1);

  private toNode(entry: OrderTimelineEntry, lang: Language): TimelineNode {
    const isPayment = entry.kind === 'PAYMENT';

    return {
      entry,
      isPayment,
      icon: isPayment ? PAYMENT_ICONS[entry.to as PaymentStatus] : FULFILLMENT_ICONS[entry.to as FulfillmentStatus],
      label: isPayment
        ? paymentStatusLabel(entry.to as PaymentStatus, lang)
        : fulfillmentStatusLabel(entry.to as FulfillmentStatus, lang),
      date: formatOrderDate(entry.at, lang, true),
    };
  }
}
