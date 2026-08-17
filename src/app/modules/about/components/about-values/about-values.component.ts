import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ValueItem {
  key: 'timelessDesign' | 'attentionToDetail' | 'qualitySelection' | 'madeForYou';
  icon: string;
}

const ITEMS: ValueItem[] = [
  { key: 'timelessDesign', icon: 'pi-hourglass' },
  { key: 'attentionToDetail', icon: 'pi-eye' },
  { key: 'qualitySelection', icon: 'pi-verified' },
  { key: 'madeForYou', icon: 'pi-heart-fill' },
];

@Component({
  selector: 'app-about-values',
  templateUrl: './about-values.component.html',
  styleUrl: './about-values.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutValuesComponent {
  readonly items = ITEMS;
}
