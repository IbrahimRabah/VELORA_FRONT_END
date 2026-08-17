import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-story',
  templateUrl: './about-story.component.html',
  styleUrl: './about-story.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutStoryComponent {}
