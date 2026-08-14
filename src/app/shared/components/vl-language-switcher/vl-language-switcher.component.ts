import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { Language } from '../../../core/enums/language';
import { LanguageStoreService } from '../../../core/state/language-store.service';

@Component({
  selector: 'app-vl-language-switcher',
  templateUrl: './vl-language-switcher.component.html',
  styleUrl: './vl-language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlLanguageSwitcherComponent {
  private readonly languageStore = inject(LanguageStoreService);

  readonly Language = Language;
  readonly lang = this.languageStore.lang;

  select(lang: Language): void {
    this.languageStore.setLanguage(lang);
  }
}
