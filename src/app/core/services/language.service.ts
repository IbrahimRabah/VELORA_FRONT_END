import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { Language } from '../enums/language';

const STORAGE_KEY = 'velora_lang';
const RTL_LANGUAGES: readonly Language[] = [Language.AR];

/**
 * Mechanism layer only — reads/persists the current language and applies it to the
 * document (lang/dir attributes) and to ngx-translate. core/state/language.store.ts
 * (batch 7) wraps this in a signal for components to read reactively.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);

  private current: Language = this.readStoredLanguage() ?? Language.AR;

  constructor() {
    this.translate.setDefaultLang(Language.AR);
    this.translate.use(this.current);
    this.applyToDocument(this.current);
  }

  getCurrentLanguage(): Language {
    return this.current;
  }

  isRtl(lang: Language = this.current): boolean {
    return RTL_LANGUAGES.includes(lang);
  }

  setLanguage(lang: Language): void {
    if (lang === this.current) {
      return;
    }
    this.current = lang;
    this.persist(lang);
    this.applyToDocument(lang);
    this.translate.use(lang);
  }

  private applyToDocument(lang: Language): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.document.documentElement.lang = lang;
    this.document.documentElement.dir = this.isRtl(lang) ? 'rtl' : 'ltr';
  }

  private persist(lang: Language): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, lang);
  }

  private readStoredLanguage(): Language | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const value = localStorage.getItem(STORAGE_KEY);
    return value === Language.AR || value === Language.EN ? (value as Language) : null;
  }
}
