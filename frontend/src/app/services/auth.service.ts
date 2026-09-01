import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/user.model';
import { environment } from '../../environments/environment.development';

const AUTH_USER_KEY = 'currentUser';
const AUTH_TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private baseUrl = environment.apiUrl.replace(/\/Tasks\/?$/i, '');
  private authUrl = `${this.baseUrl}/Auth`;

  // Reactive state signals
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    this.loadUserFromStorage();
  }

  // Load existing session from browser localStorage
  private loadUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const userStr = localStorage.getItem(AUTH_USER_KEY);
      const tokenStr = localStorage.getItem(AUTH_TOKEN_KEY);
      if (userStr) {
        try {
          this.currentUser.set(JSON.parse(userStr));
        } catch {
          localStorage.removeItem(AUTH_USER_KEY);
        }
      }
      if (tokenStr) {
        this.token.set(tokenStr);
      }
    }
  }

  // Register a new user account
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  // Sign in an existing user
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, data).pipe(
      tap((res) => this.setSession(res))
    );
  }

  // Fetch all registered team users for task assignment
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.authUrl}/users`);
  }

  // Save authenticated session in signals and localStorage
  private setSession(res: AuthResponse) {
    this.currentUser.set(res.user);
    this.token.set(res.token);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
      localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    }
  }

  // Clear current user session
  logout() {
    this.currentUser.set(null);
    this.token.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_USER_KEY);
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }
}
