import { ChangeDetectionStrategy, Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/constants/app-config';

type CardLink =
  | { kind: 'href'; url: string; external: boolean }
  | { kind: 'route'; url: string }
  | { kind: 'none' };

interface ContactCard {
  key: 'whatsapp' | 'phone' | 'email' | 'trackOrder' | 'cod';
  icon: string;
  value: string | null;
  link: CardLink;
}

const CARDS: ContactCard[] = [
  { key: 'whatsapp', icon: 'pi-whatsapp', value: APP_CONFIG.contact.phone, link: { kind: 'href', url: APP_CONFIG.contact.whatsappUrl, external: true } },
  { key: 'phone', icon: 'pi-phone', value: APP_CONFIG.contact.phone, link: { kind: 'href', url: `tel:${APP_CONFIG.contact.phone}`, external: false } },
  { key: 'email', icon: 'pi-envelope', value: APP_CONFIG.contact.email, link: { kind: 'href', url: `mailto:${APP_CONFIG.contact.email}`, external: false } },
  { key: 'trackOrder', icon: 'pi-box', value: null, link: { kind: 'route', url: '/me/orders' } },
  { key: 'cod', icon: 'pi-money-bill', value: null, link: { kind: 'none' } },
];

@Component({
  selector: 'app-contact-cards',
  templateUrl: './contact-cards.component.html',
  styleUrl: './contact-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCardsComponent {
  readonly cards = CARDS;
}
