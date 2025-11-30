import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Shape of the login response coming from the backend
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

// Shape of the register response coming from the backend
export interface RegisterResponse {
  message: string;
}

/**
 * AuthService
 *
 * - Handles login / register HTTP calls
 * - Stores and retrieves the JWT access token
 * - Stores and retrieves the current user
 * - Exposes helpers like isAuthenticated() and getUsername()
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:500/api/auth';
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'current_user';

  constructor(private readonly http: HttpClient) {}

  /**
   * POST /api/auth/login
   * Expects email, password and returns access_token, user
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/login`;
    const body = { email, password };
    return this.http.post<LoginResponse>(url, body);
  }

  /**
   * POST /api/auth/register
   * Expects username, email, password 
   */
  register(
    username: string,
    email: string,
    password: string,
  ): Observable<RegisterResponse> {
    const url = `${this.apiUrl}/register`;
    const body = { username, email, password };
    return this.http.post<RegisterResponse>(url, body);
  }

  // Save JWT token to localStorage
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get JWT token from localStorage, or null if missing
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Save current user to localStorage
  setUser(user: LoginResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get current user from localStorage, or null if missing / invalid
  getUser(): LoginResponse['user'] | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as LoginResponse['user'];
    } catch (err) {
      console.error('Failed to parse stored user:', err);
      return null;
    }
  }

  // Helper to get the username
  getUsername(): string | null {
    const user = this.getUser();
    return user ? user.username : null;
  }

  // Remove token AND user from localStorage (logout)
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Simple check whether we have a token stored
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
