import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * authGuard
 *
 * Route guard to protect private routes (like /tasks)
 *
 * Behaviour:
 *  - If the user is authenticated (JWT token present), allow navigation
 *  - If not authenticated, redirect to /login and block navigation
 *
 * This uses the functional guard style introduced in recent Angular versions
 * (CanActivateFn + inject())
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check authentication using AuthService helper
  const isLoggedIn = authService.isAuthenticated();

  if (isLoggedIn) {
    // User has a token, allow navigating to the route
    return true;
  }

  // Not authenticated, redirect to /login
  router.navigate(['/login'], {
    queryParams: { redirectTo: state.url }, // remember target
  });

  // Block navigation
  return false;
};
