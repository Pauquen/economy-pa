import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * ThemeService - Sistema de Gestión de Temas
 * 
 * Maneja el toggle entre tema claro y oscuro con persistencia en localStorage
 * Utiliza Signals para estado reactivo (Angular 20)
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'economyrpa-theme';

  /** Signal reactive para el estado actual del tema */
  private readonly _isDark = signal<boolean>(false); // Default para SSR

  /** Computed signal para acceso público readonly */
  readonly isDark = this._isDark.asReadonly();

  /** Signal para el nombre de la clase del tema */
  readonly currentTheme = computed(() => 
    this._isDark() ? 'dark-theme' : 'light-theme'
  );

  constructor() {
    // Inicializar tema solo en el browser
    if (isPlatformBrowser(this.platformId)) {
      const initialTheme = this.getStoredTheme();
      this._isDark.set(initialTheme);
      this.applyTheme(initialTheme);
    }
  }

  /**
   * Toggle entre temas claro/oscuro con smooth transition
   */
  toggleTheme(): void {
    const newTheme = !this._isDark();
    this._isDark.set(newTheme);
    this.applyTheme(newTheme);
    this.saveTheme(newTheme);
  }

  /**
   * Setear tema específico (programático)
   */
  setTheme(isDark: boolean): void {
    if (this._isDark() !== isDark) {
      this._isDark.set(isDark);
      this.applyTheme(isDark);
      this.saveTheme(isDark);
    }
  }

  /**
   * Obtener preferencia del sistema operativo
   */
  getSystemPreference(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Default para SSR
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Resetear al tema del sistema
   */
  resetToSystemTheme(): void {
    const systemTheme = this.getSystemPreference();
    this.setTheme(systemTheme);
  }

  /**
   * Aplicar clase CSS al body con efectos smooth
   */
  private applyTheme(isDark: boolean): void {
    const body = this.document.body;
    
    if (isDark) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }

    // Para acceso programático y testing
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }

  /**
   * Persistir preferencia en localStorage
   */
  private saveTheme(isDark: boolean): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // No hacer nada en SSR
    }
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(isDark));
    } catch (error) {
      console.warn('ThemeService: Could not save theme preference', error);
    }
  }

  /**
   * Recuperar tema guardado o fallback a preferencia del sistema
   */
  private getStoredTheme(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Default para SSR
    }
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored !== null ? JSON.parse(stored) : this.getSystemPreference();
    } catch (error) {
      console.warn('ThemeService: Could not read stored theme, using system preference', error);
      return this.getSystemPreference();
    }
  }
}