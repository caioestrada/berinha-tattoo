import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'berinha-admin-auth';
const ADMIN_PASSWORD = 'berinha2026';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly isAuthenticated = signal(localStorage.getItem(STORAGE_KEY) === 'true');

  login(password: string): boolean {
    const ok = password === ADMIN_PASSWORD;
    if (ok) {
      localStorage.setItem(STORAGE_KEY, 'true');
      this.isAuthenticated.set(true);
    }
    return ok;
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.isAuthenticated.set(false);
  }
}
