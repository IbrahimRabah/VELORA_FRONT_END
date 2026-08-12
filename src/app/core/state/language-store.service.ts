import { Injectable, computed, inject, signal } from '@angular/core';

import { Language } from '../enums/language';
import { LanguageService } from '../services/language.service';

/**
 * Reactive wrapper around LanguageService (core/services). LanguageService already
 * applies `lang`/`dir` to documentElement and persists the choice, both guarded by
 * isPlatformBrowser internally — this store delegates to it on every change rather than
 * duplicating that DOM/storage logic, and just holds the value as a signal for components.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStoreService {
  private readonly languageService = inject(LanguageService);

  private readonly _lang = signal<Language>(this.languageService.getCurrentLanguage());

  readonly lang = this._lang.asReadonly();
  readonly isRtl = computed(() => this.languageService.isRtl(this._lang()));
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.isRtl() ? 'rtl' : 'ltr'));

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
    this._lang.set(lang);
  }
}
