import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { CartWarning } from '../../../../core/enums/cart-warning';
import { CartItemResponse, CartWarningEntry } from '../../../../core/models';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-cart-item-row',
  templateUrl: './cart-item-row.component.html',
  styleUrl: './cart-item-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemRowComponent implements OnChanges, OnInit, OnDestroy {
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly translate = inject(TranslateService);
  private readonly qty$ = new Subject<number>();
  private readonly destroy$ = new Subject<void>();

  @Input({ required: true }) item!: CartItemResponse;
  @Input() warnings: CartWarningEntry[] = [];
  @Input() pending = false;

  @Output() readonly quantityChange = new EventEmitter<{ itemId: number; quantity: number }>();
  @Output() readonly removeItem = new EventEmitter<number>();

  displayQuantity = 1;

  get maxQuantity(): number {
    return Math.max(0, Math.min(this.item.qtyAvailable, 99));
  }

  get blockingWarnings(): CartWarningEntry[] {
    return this.warnings.filter((warning) => warning.code !== CartWarning.PRICE_CHANGED);
  }

  get priceWarning(): CartWarningEntry | undefined {
    return this.warnings.find((warning) => warning.code === CartWarning.PRICE_CHANGED);
  }

  get isBlocked(): boolean {
    return this.blockingWarnings.length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item']) {
      this.displayQuantity = this.item.quantity;
    }
  }

  ngOnInit(): void {
    this.qty$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((quantity) => this.quantityChange.emit({ itemId: this.item.itemId, quantity }));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  decrease(): void {
    this.setQuantity(this.displayQuantity - 1);
  }

  increase(): void {
    this.setQuantity(this.displayQuantity + 1);
  }

  onRemove(): void {
    this.confirmDialogService
      .confirm({
        title: this.translate.instant('cart.confirmRemoveTitle'),
        message: this.translate.instant('cart.confirmRemoveMessage', { name: this.item.name }),
        confirmLabel: this.translate.instant('cart.removeItem'),
        cancelLabel: this.translate.instant('common.cancel'),
        danger: true,
      })
      .subscribe((confirmed) => {
        if (confirmed) {
          this.removeItem.emit(this.item.itemId);
        }
      });
  }

  private setQuantity(next: number): void {
    const clamped = Math.min(Math.max(next, 1), this.maxQuantity);
    if (clamped === this.displayQuantity) {
      return;
    }
    this.displayQuantity = clamped;
    this.qty$.next(clamped);
  }
}
