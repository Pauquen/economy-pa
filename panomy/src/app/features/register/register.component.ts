import { Component, inject, signal, computed, NgZone, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../services/enviroments/environment';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import type { User } from '../../models';
import { ButtonComponent, InputComponent } from '../../shared';
import { FormsModule } from '@angular/forms';

declare var google: any;
/**
 * RegisterComponent - Página de Registro Temporal
 *
 * Placeholder hasta que implementemos el formulario completo
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterModule,
    InputComponent,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {
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
  readonly fullName = signal<string>('');
  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly confirmPassword = signal<string>('');
  readonly lenguange = signal<string>('en');
  readonly role = signal<string>('')
  readonly currentStep = signal<number>(1);
  readonly totalSteps = 3;
  readonly agreedToTerms = signal<boolean>(false);

  ngOnInit(): void {
    // Redirigir si ya está autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

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

  /** Computed signal para validación del formulario */
  readonly isStep1Valid = computed(() => {
    return (
      this.email().includes('@') &&
      this.email().length > 5 &&
      this.password().length >= 6 &&
      this.password() === this.confirmPassword()
    );
  });

  // Paso 2: Identidad
  readonly isStep2Valid = computed(() => this.fullName().trim().length > 3);

  // Validación Global para el Submit final
  readonly isFormValid = computed(() =>
    this.isStep1Valid() &&
    this.isStep2Valid() &&
    this.role() != '' &&
    this.agreedToTerms()
  );


  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(val => val + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(val => val - 1);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid() || this.isLoading()) {
      return;
    }

    const success = await this.authService.register({
      fullName: this.fullName(),
      email: this.email(),
      password: this.password(),
      confirmPassword: this.confirmPassword(),
    });

    if (success) {
      const user = this.authService.currentUser();
      this.redirectBasedOnRole(user);
    }
  }

  constructor() {
    // Theme is automatically applied by ThemeService
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

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
