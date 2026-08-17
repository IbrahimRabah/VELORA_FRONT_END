import { ChangeDetectionStrategy, Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/constants/app-config';

type HelpLink = { kind: 'route'; url: string } | { kind: 'href'; url: string };

interface HelpCard {
  key: 'orderHelp' | 'cancelOrder' | 'delivery' | 'somethingElse';
  icon: string;
  link: HelpLink;
}

const HELP_CARDS: HelpCard[] = [
  { key: 'orderHelp', icon: 'pi-truck', link: { kind: 'route', url: '/me/orders' } },
  { key: 'cancelOrder', icon: 'pi-times-circle', link: { kind: 'route', url: '/me/orders' } },
  { key: 'delivery', icon: 'pi-map-marker', link: { kind: 'route', url: '/products' } },
  { key: 'somethingElse', icon: 'pi-comments', link: { kind: 'href', url: APP_CONFIG.contact.whatsappUrl } },
];

@Component({
  selector: 'app-contact-help',
  templateUrl: './contact-help.component.html',
  styleUrl: './contact-help.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactHelpComponent {
  readonly cards = HELP_CARDS;
}
