import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  AuthService,
  LoginResponse,
} from '../../core/services/auth.service';

/**
 * LoginComponent
 *
 * - Renders the login form
 * - Submits credentials to the AuthService
 * - Stores token and user (id, email, username) on success
 * - Navigates to /tasks after successful login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent implements OnInit {
  // Reactive form for email and password
  loginForm!: FormGroup;

  // UI state
  hidePassword = true;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  // Initialize the login form with validators
  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
    });
  }

  // Getter for easy access to form controls
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Handle form submission.
   * Calls AuthService.login, stores token and user, then navigates to /tasks
   */
  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.authService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        try {
          // Save JWT token
          this.authService.setToken(response.access_token);
          // Save current user
          this.authService.setUser(response.user);
        } catch (err) {
          console.error('Failed to store auth data in localStorage:', err);
        }

        this.isSubmitting = false;

        // Navigate to the private tasks screen
        this.router.navigate(['/tasks']);
      },
      error: (err: unknown) => {
        console.error('Login failed:', err);
        this.isSubmitting = false;

        // Simple feedback
        alert('Login failed. Please check your email and password.');
      },
    });
  }

  // Navigate to the register screen when the user clicks "Create account"
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}

