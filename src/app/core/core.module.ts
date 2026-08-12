import { APP_INITIALIZER, NgModule, Optional, PLATFORM_ID, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { GuestTokenInterceptor } from './interceptors/guest-token.interceptor';
import { LanguageInterceptor } from './interceptors/language.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { appInitializer } from './initializers/app.initializer';
import { AuthApiService } from './services/api/auth-api.service';
import { CartApiService } from './services/api/cart-api.service';
import { GuestTokenService } from './services/guest-token.service';
import { AuthStoreService } from './state/auth-store.service';
import { CartStoreService } from './state/cart-store.service';
import { LanguageStoreService } from './state/language-store.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: GuestTokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LanguageInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [PLATFORM_ID, LanguageStoreService, AuthStoreService, AuthApiService, GuestTokenService, CartApiService, CartStoreService],
      multi: true,
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in AppModule only.');
    }
  }
}
