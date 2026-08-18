import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-vl-progress-bar',
  templateUrl: './vl-progress-bar.component.html',
  styleUrl: './vl-progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlProgressBarComponent {
  private readonly loadingService = inject(LoadingService);

  readonly loading = toSignal(this.loadingService.isLoading$, { initialValue: false });
}
