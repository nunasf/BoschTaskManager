import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { routes } from './app.routes';

import {
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Import custom JWT interceptor
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),

    // HttpClient + JWT interceptor
    provideHttpClient(
      withInterceptors([
        authInterceptor, // attaches Authorization: Bearer <token>
      ])
    ),
  ],
};
