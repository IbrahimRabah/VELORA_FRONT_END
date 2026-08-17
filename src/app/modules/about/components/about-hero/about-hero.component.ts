import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-hero',
  templateUrl: './about-hero.component.html',
  styleUrl: './about-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutHeroComponent {}
