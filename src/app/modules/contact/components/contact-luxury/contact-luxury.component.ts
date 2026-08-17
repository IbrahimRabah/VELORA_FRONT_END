import { ChangeDetectionStrategy, Component } from '@angular/core';

interface StripItem {
  key: 'cod' | 'delivery' | 'support';
  icon: string;
}

const STRIP_ITEMS: StripItem[] = [
  { key: 'cod', icon: 'pi-money-bill' },
  { key: 'delivery', icon: 'pi-truck' },
  { key: 'support', icon: 'pi-whatsapp' },
];

@Component({
  selector: 'app-contact-luxury',
  templateUrl: './contact-luxury.component.html',
  styleUrl: './contact-luxury.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLuxuryComponent {
  readonly stripItems = STRIP_ITEMS;
}
