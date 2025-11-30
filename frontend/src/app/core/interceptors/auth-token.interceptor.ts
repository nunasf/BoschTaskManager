import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * authTokenInterceptor
 *
 * HTTP interceptor that automatically attaches the JWT access token
 * to every HTTP request going to Flask API (http://localhost:500/api)
 *
 * This keeps our services (like TaskService, AuthService) clean,
 * since they no longer need to manually manage Authorization headers
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Only attach the header if we have a token AND the request is for the API
  const isApiRequest = req.url.startsWith('http://localhost:500/api');

  if (token && isApiRequest) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(authReq);
  }

  // If no token or not an API request, just forward the original request
  return next(req);
};