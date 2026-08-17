import { ChangeDetectionStrategy, Component } from '@angular/core';

import { APP_CONFIG } from '../../../../core/constants/app-config';

interface PromiseItem {
  key: 'cod' | 'delivery' | 'cancellation' | 'authentic' | 'whatsapp';
  icon: string;
  href: string | null;
}

const ITEMS: PromiseItem[] = [
  { key: 'cod', icon: 'pi-money-bill', href: null },
  { key: 'delivery', icon: 'pi-truck', href: null },
  { key: 'cancellation', icon: 'pi-replay', href: null },
  { key: 'authentic', icon: 'pi-verified', href: null },
  { key: 'whatsapp', icon: 'pi-whatsapp', href: APP_CONFIG.contact.whatsappUrl },
];

@Component({
  selector: 'app-about-promise',
  templateUrl: './about-promise.component.html',
  styleUrl: './about-promise.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPromiseComponent {
  readonly items = ITEMS;
}
