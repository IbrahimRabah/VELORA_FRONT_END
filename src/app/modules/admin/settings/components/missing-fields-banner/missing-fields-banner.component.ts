import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-missing-fields-banner',
  templateUrl: './missing-fields-banner.component.html',
  styleUrl: './missing-fields-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MissingFieldsBannerComponent {

}
