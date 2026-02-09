import { Injectable, signal, computed, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import type { User, UserPreferences, ApiResponse } from '../models';
import { environment } from "./enviroments/environment";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

/**
 * AuthService - Servicio de Autenticación
 *
 * Maneja login, registro, logout y estado de sesión
 * Utiliza Signals para estado reactivo (Angular 20)
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** Variables para comunciacion con backend */
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  /** Estado de carga */
  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  /** Mensaje de error */
  private readonly _errorMessage = signal<string>('');
  readonly errorMessage = this._errorMessage.asReadonly();

  /** Usuario actual autenticado */
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  /** Estado de autenticación */
  readonly isAuthenticated = computed(() =>
    this._currentUser() !== null
  );

  /** Check si es primer login */
  readonly isFirstLogin = computed(() => {
    const user = this._currentUser();
    return user ? user.lastLoginAt === undefined : false;
  });

  constructor() {
    // Restaurar sesión solo en el browser
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession();
    }
  }

  /**
   * Iniciar sesión
   */
  async login(email: string, password: string): Promise<boolean> {
    this._isLoading.set(true);
    this._errorMessage.set('');

    try {
      const response = await this.callLoginApi(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Guardar token y usuario
        this.saveToken(token);
        this._currentUser.set(user);

        // Actualizar último login
        const updatedUser = {
          ...user,
          lastLoginAt: new Date().toISOString()
        };
        this._currentUser.set(updatedUser);
        this.saveUser(updatedUser);

        return true;
      } else {
        this._errorMessage.set(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      this._errorMessage.set('An unexpected error occurred');
      console.error('Login error:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(userData: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<boolean> {
    this._isLoading.set(true);
    this._errorMessage.set('');

    try {
      // Validaciones básicas
      if (userData.password !== userData.confirmPassword) {
        this._errorMessage.set('Passwords do not match');
        return false;
      }

      // Simulación de API call
      const response = await this.callRegisterApi(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Auto-login después de registro
        this.saveToken(token);
        this._currentUser.set(user);
        this.saveUser(user);

        return true;
      } else {
        this._errorMessage.set(response.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      this._errorMessage.set('An unexpected error occurred');
      console.error('Registration error:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  async loginWithGoogle(googleToken: string): Promise<boolean> {
    this._isLoading.set(true);
    this._errorMessage.set('');

    try {
      const response = await this.callGoogleLoginApi(googleToken);

      if (response.success && response.data) {
        const { user, token } = response.data;
        this.saveToken(token);
        this._currentUser.set(user);
        this.saveUser(user);

        return true;
      }
      else {
        this._errorMessage.set(response.message || 'Google login failed');
        return false;
      }
    }
    catch(error) {
      this._errorMessage.set('Error de comunciacion con Google Auth');
      return false;
    }
    finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    // Limpiar estado local
    this._currentUser.set(null);
    this._errorMessage.set('');

    // Limpiar storage solo en browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }

    // Redirigir a login
    this.router.navigate(['/login']);
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateProfile(userData: Partial<User>): Promise<boolean> {
    this._isLoading.set(true);
    this._errorMessage.set('');

    try {
      // Simulación de API call
      const response = await this.callUpdateProfileApi(userData);

      if (response.success && response.data) {
        const updatedUser = response.data;
        this._currentUser.set(updatedUser);
        this.saveUser(updatedUser);
        return true;
      } else {
        this._errorMessage.set(response.message || 'Update failed');
        return false;
      }
    } catch (error) {
      this._errorMessage.set('An unexpected error occurred');
      console.error('Update profile error:', error);
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('auth_token');
  }

  /**
   * Limpiar mensaje de error
   */
  clearError(): void {
    this._errorMessage.set('');
  }

  // ========================================
  // PRIVATE METHODS
  // ========================================

  private saveToken(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('auth_token', token);
  }

  private saveUser(user: User): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        const user = JSON.parse(userData);
        this._currentUser.set(user);
      }
    } catch (error) {
      console.warn('Could not restore session:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // ========================================
  // API METHODS
  // ========================================

  private async callLoginApi(email: string, password: string): Promise<ApiResponse<{user: User, token: string}>> {
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}login/`, {email, password})
      );

      return {
        success: true,
        data: {
          user: res.user,
          token: res.access
        }
      };
    }
    catch(error) {
      const err = error as HttpErrorResponse;
      return {
        success: false,
        message: err.error?.detail || 'Credenciales invalidas'
      }
    }
  }

  private async callRegisterApi(userData: any): Promise<ApiResponse<{user: User, token: string}>> {
    try {
      const body = {
        email: userData.email,
        password: userData.password,
        confirm_password: userData.confirmPassword,
        username: userData.email.split('@')[0],
        full_name: userData.fullName
      };

      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}register/`, body)
      );

      return {
        success: true,
        data: {
          user: res.user,
          token: res.access
        }
      };
    }
    catch(error) {
      const err = error as HttpErrorResponse;
      let msg = 'Error de Registro'
      if (err.status === 400 && err.error) {
        msg = Object.values(err.error)[0] as string;
      }
      return { success: false, message: msg};
    }
  }

  private async callUpdateProfileApi(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const res = await firstValueFrom(
        this.http.patch<User>(`${this.baseUrl}auth/user/`, userData)
      );

      return { success: true, data: res };
    }
    catch(error){
      const err = error as HttpErrorResponse
      return {
        success: false,
        message: 'No se pudo actualizar el perfil'
      }
    }
  }

  private async callGoogleLoginApi(token: string): Promise<ApiResponse<{user: User, token: string}>>{
    try {
      const res = await firstValueFrom(
        this.http.post<any>(`${this.baseUrl}auth/google/`, { access_token: token})
      );

      return {
        success: true,
        data: {
          user: res.user,
          token: res.access
        }
      };
    }
    catch(error) {
      const err = error as HttpErrorResponse;
      return {
        success: false,
        message: err.error?.detail || 'Error en validacion con Google'
      };
    }
  }
}
