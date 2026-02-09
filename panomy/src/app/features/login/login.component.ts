import { Component, computed, inject, signal, NgZone, OnInit, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../services/enviroments/environment';
import { ButtonComponent, InputComponent } from '../../shared';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import type { User } from '../../models';
import { FormsModule } from '@angular/forms';

declare var google: any;
/**
 * LoginComponent - Página de Inicio de Sesión
 *
 * Standalone component con Signals para estado reactivo
 * Formulario de login con validación y loading states
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    ButtonComponent,
    InputComponent,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeService = inject(ThemeService);

  /** Estado reactivo del servicio */
  readonly isLoading = this.authService.isLoading;
  readonly errorMessage = this.authService.errorMessage;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isDarkTheme = this.themeService.isDark;

  /** Form data signals */
  readonly email = signal<string>('');
  readonly password = signal<string>('');

  /** Computed signal para validación del formulario */
  readonly isFormValid = computed(() => {
    return (
      this.email().includes('@') &&
      this.email().length > 5 &&
      this.password().length >= 6
    );
  });

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initGoogleAuth();
      }, 100);
    }
  }

  private initGoogleAuth(): void {
    // Chequeo de seguridad: ¿Existe la variable global google?
    if (typeof google === 'undefined') {
      console.error('CRÍTICO: El script de Google no se ha cargado en el index.html');
      return;
    }

    // @ts-ignore
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (res: any) => {
        this.ngZone.run(() => this.handleGoogleLogin(res));
      }
    });

    const btnElement = document.getElementById('google-btn');

    if (btnElement) {
      // @ts-ignore
      google.accounts.id.renderButton(
        btnElement,
        {
          theme: 'outline',
          size: 'large',
          // 3. TRUCO: Quita el width fijo de 350 si tu contenedor es responsivo
          // O usa 'width': btnElement.clientWidth.toString()
          type: 'standard',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
          width: '350',
        }
      );
      console.log('Google Button Renderizado correctamente');
    } else {
      console.error('CRÍTICO: Angular no encontró el div con id "google-btn"');
    }
  }

  async handleGoogleLogin(response: any) {
    const token = response.credential;
    const success = await this.authService.loginWithGoogle(token);

    if (success) {
      this.ngZone.run(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  /** Redirigir si ya está autenticado */
  constructor() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  /**
   * Manejar submit del formulario
   */
  async onSubmit(): Promise<void> {
    if (!this.isFormValid() || this.isLoading()) {
      return;
    }

    const success = await this.authService.login(
      this.email(),
      this.password()
    );

    if (success) {
      // Redirección basada en rol
      const user = this.authService.currentUser();
      this.redirectBasedOnRole(user);
    }
  }

  /**
   * Limpiar mensaje de error
   */
  clearError(): void {
    this.authService.clearError();
  }

  /**
   * Login con Google OAuth

  async loginWithGoogle(response: any): Promise<void> {
    if (this.isLoading()) return;

    const token = response.credential;
    const success = await this.authService.loginWithGoogle(token);

    if (success) {
      this.redirectBasedOnRole(this.authService.currentUser())
    }
  }
  */

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Redirigir según el rol del usuario (SE USARA LUEGO PARA AMPLIAR LA PLATAFORMA)
   */
  private redirectBasedOnRole(user: User | null): void {
    if (!user) return;

    switch (user.role) {
      case 'super_admin':
      case 'admin':
        this.router.navigate(['/home']);
        break;
      case 'manager':
        this.router.navigate(['/home']);
        break;
      case 'operator':
        this.router.navigate(['/home']);
        break;
      case 'viewer':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
}
