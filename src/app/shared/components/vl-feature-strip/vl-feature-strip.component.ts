import { ChangeDetectionStrategy, Component } from '@angular/core';

// The 4 store-wide trust badges (cash on delivery, nationwide delivery, free
// cancellation, authenticity) — reuses product.features.* since the copy is
// identical to what already shipped on the PDP.
@Component({
  selector: 'app-vl-feature-strip',
  templateUrl: './vl-feature-strip.component.html',
  styleUrl: './vl-feature-strip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlFeatureStripComponent {}
