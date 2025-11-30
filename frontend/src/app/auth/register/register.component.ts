import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material modules used in the register UI
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// Auth service + response type
import {
  AuthService,
  RegisterResponse,
} from '../../core/services/auth.service';

/**
 * RegisterComponent
 *
 * Standalone Angular component that represents the registration page
 * Uses Angular Material and Reactive Forms
 *
 * Behaviour:
 *  - POST /api/auth/register via AuthService
 *  - On success: alert + redirect to /login (option A)
 */
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class RegisterComponent {
  /**
   * Reactive form group for registration
   * Fields:
   *  - username: required
   *  - email: required, valid email
   *  - password: required, min length 6
   */
  registerForm: FormGroup;

  // Loading flag to disable the button while submitting
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter to access form controls in the template
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Handle registration form submission
   *
   * Flow:
   *  1) Validate form
   *  2) Call AuthService.register(username, email, password)
   *  3) On success: show alert + redirect to /login
   *  4) On error: show alert and re-enable button
   */
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { username, email, password } = this.registerForm.value;

    this.authService.register(username, email, password).subscribe({
      next: (response: RegisterResponse) => {
        console.log('Registration success!', response);

        alert('Registration successful! You can now log in.');
        this.isSubmitting = false;

        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      error: (err: unknown) => {
        console.error('Registration failed:', err);

        alert('Registration failed. Please check the data and try again.');
        this.isSubmitting = false;
      },
    });
  }

  // Navigate back to the login page
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}