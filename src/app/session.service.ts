import { Injectable, signal } from '@angular/core';
import { LoginResponse } from './models';

const TOKEN_KEY = 'feedback_token';
const USERNAME_KEY = 'feedback_username';
const ROLE_KEY = 'feedback_role';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly username = signal<string | null>(localStorage.getItem(USERNAME_KEY));
  readonly role = signal<string | null>(localStorage.getItem(ROLE_KEY));

  setSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USERNAME_KEY, response.username);
    localStorage.setItem(ROLE_KEY, response.role);
    this.token.set(response.token);
    this.username.set(response.username);
    this.role.set(response.role);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    this.token.set(null);
    this.username.set(null);
    this.role.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  isAdmin(): boolean {
    return this.role() === 'ADMIN';
  }

  homeRoute(): string {
    return this.isAdmin() ? '/admin' : '/feedback';
  }
}
