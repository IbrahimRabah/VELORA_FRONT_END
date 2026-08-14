import { ChangeDetectionStrategy, Component, Input, OnDestroy, computed, effect, signal, untracked } from '@angular/core';

import { ImageResponse } from '../../../../core/models';

@Component({
  selector: 'app-product-gallery',
  templateUrl: './product-gallery.component.html',
  styleUrl: './product-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGalleryComponent implements OnDestroy {
  private readonly imagesSignal = signal<ImageResponse[]>([]);
  private readonly preferredImageIdSignal = signal<number | null>(null);
  private readonly activeIndex = signal(0);
  private readonly imageOpacitySignal = signal(1);
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;
  private hasImages = false;

  @Input({ required: true }) productName!: string;

  // A signal-backed accessor, not a plain field — activeImage below reads imagesSignal()
  // (a real signal), not the raw @Input. computed() only tracks signal reads: a plain
  // @Input field mutated by Angular's input binding is invisible to it, so activeImage
  // would never re-run when a new images array arrived. That's what caused the reported
  // bug — the *ngFor thumbnail list re-scans the plain array every CD pass and looked
  // fresh, while activeImage stayed frozen on stale data across variant/color switches.
  @Input({ required: true })
  set images(value: ImageResponse[]) {
    this.imagesSignal.set(value);
  }
  get images(): ImageResponse[] {
    return this.imagesSignal();
  }

  // The image the gallery should land on whenever `images` is replaced by a variant/color
  // switch — the new color's own shot, not necessarily index 0 (the poster is often pinned
  // first in the rebuilt array). Ignored by direct navigation (thumbnail click, prev/next).
  @Input()
  set activeImageId(value: number | null) {
    this.preferredImageIdSignal.set(value ?? null);
  }

  readonly index = this.activeIndex.asReadonly();
  readonly imageOpacity = this.imageOpacitySignal.asReadonly();
  readonly activeImage = computed(() => this.imagesSignal()[this.activeIndex()] ?? null);

  constructor() {
    // Re-lands the active index whenever the images array or the preferred image id changes.
    // Reads both signals fresh on every run, so it lands correctly regardless of which
    // @Input setter fired first within a given change-detection pass. Skips the crossfade
    // on the very first non-empty images array (nothing was visible before, so there's
    // nothing to fade from) — every array replacement after that is a variant/color switch.
    effect(() => {
      const images = this.imagesSignal();
      const preferredId = this.preferredImageIdSignal();
      const foundIndex = preferredId != null ? images.findIndex((image) => image.id === preferredId) : -1;
      const targetIndex = foundIndex >= 0 ? foundIndex : 0;

      if (!this.hasImages) {
        this.hasImages = images.length > 0;
        this.activeIndex.set(targetIndex);
        return;
      }
      this.goToIndex(targetIndex);
    }, { allowSignalWrites: true });
  }

  ngOnDestroy(): void {
    if (this.fadeTimer) clearTimeout(this.fadeTimer);
  }

  select(i: number): void {
    this.goToIndex(i);
  }

  previous(): void {
    this.step(-1);
  }

  next(): void {
    this.step(1);
  }

  private step(direction: number): void {
    const count = this.imagesSignal().length;
    if (!count) return;
    this.goToIndex((this.activeIndex() + direction + count) % count);
  }

  private goToIndex(index: number): void {
    // untracked: this runs inside the constructor effect too (variant/color switch path).
    // A plain read here would make activeIndex a tracked dependency of that effect — and
    // since this method also writes activeIndex, any later write (e.g. a manual thumbnail
    // click) would re-trigger the effect, which reapplies the stale preferredImageId and
    // silently reverts the click. That was the reported bug: picking a color once "locked"
    // the gallery, so a poster click no longer registered until the color was deselected.
    if (index === untracked(this.activeIndex)) return;

    this.activeIndex.set(index);
    this.imageOpacitySignal.set(0);
    if (this.fadeTimer) clearTimeout(this.fadeTimer);
    this.fadeTimer = setTimeout(() => this.imageOpacitySignal.set(1), 20);
  }
}
