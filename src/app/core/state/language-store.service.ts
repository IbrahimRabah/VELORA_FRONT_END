import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../enums/language';
import { LanguageService } from '../services/language.service';

/**
 * Reactive wrapper around LanguageService (core/services). LanguageService already
 * applies `lang`/`dir` to documentElement and persists the choice, both guarded by
 * isPlatformBrowser internally — this store delegates to it on every change rather than
 * duplicating that DOM/storage logic, and just holds the value as a signal for components.
 *
 * Also the one place that calls TranslateService.use() — LanguageService itself deliberately
 * can't (see its doc comment on the NG0200 circular-DI risk via language.interceptor). This
 * store has no such constraint, so it activates translations in lockstep with dir/lang: once
 * at construction (forced eager via app.initializer's APP_INITIALIZER dep, so it runs before
 * first render on both platforms) and again on every setLanguage().
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageStoreService {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  private readonly _lang = signal<Language>(this.languageService.getCurrentLanguage());

  readonly lang = this._lang.asReadonly();
  readonly isRtl = computed(() => this.languageService.isRtl(this._lang()));
  readonly dir = computed<'rtl' | 'ltr'>(() => (this.isRtl() ? 'rtl' : 'ltr'));

  constructor() {
    this.translate.use(this._lang());
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
    this._lang.set(lang);
    this.translate.use(lang);
  }
}
