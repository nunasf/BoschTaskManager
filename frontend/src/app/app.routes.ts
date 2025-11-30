import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Application routes.
 *
 * Public:
 *  - /login
 *  - /register
 *
 * Private (requires JWT, guarded by authGuard):
 *  - /tasks
 *
 * All unknown paths redirect to /login.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./tasks/task-list/task-list.component').then(
        (m) => m.TaskListComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
