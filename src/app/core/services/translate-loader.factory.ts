import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, of } from 'rxjs';

import { Language } from '../enums/language';
import ar from '../../../assets/i18n/ar.json';
import en from '../../../assets/i18n/en.json';

const STATIC_TRANSLATIONS: Record<Language, TranslationObject> = {
  [Language.AR]: ar,
  [Language.EN]: en,
};

/**
 * Server-only loader. Node's fetch (used by provideHttpClient(withFetch())) rejects the
 * relative URL TranslateHttpLoader builds ('./assets/i18n/ar.json') since there is no page
 * origin to resolve it against, and this app's CommonEngine/prerender setup has no live
 * server to answer that request during `ng build` anyway. So instead of a network round
 * trip, SSR reads the same JSON straight out of the compiled bundle.
 */
class StaticTranslateLoader extends TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(STATIC_TRANSLATIONS[lang as Language] ?? STATIC_TRANSLATIONS[Language.AR]);
  }
}

export function translateLoaderFactory(http: HttpClient, platformId: object): TranslateLoader {
  return isPlatformBrowser(platformId)
    ? new TranslateHttpLoader(http, './assets/i18n/', '.json')
    : new StaticTranslateLoader();
}
