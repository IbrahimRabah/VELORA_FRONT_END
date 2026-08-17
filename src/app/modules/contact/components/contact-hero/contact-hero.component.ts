import { ChangeDetectionStrategy, Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/constants/app-config';

@Component({
  selector: 'app-contact-hero',
  templateUrl: './contact-hero.component.html',
  styleUrl: './contact-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactHeroComponent {
  readonly whatsappUrl = APP_CONFIG.contact.whatsappUrl;
}
