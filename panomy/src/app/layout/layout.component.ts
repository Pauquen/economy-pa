import { Component, computed, inject, signal, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from '../shared';
import { ThemeService, AuthService } from '../services';

/**
 * LayoutComponent - Layout Principal de la Aplicación
 *
 * Contiene el sidebar, header y el router-outlet principal
 * Sistema de navegación con estado activo y responsive design
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonComponent
  ],
  template: `
    <div class="layout-container" [class.mobile-sidebar-open]="mobileSidebarOpen()">
      <!-- Sidebar Navigation -->
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed()" [class.mobile-open]="mobileSidebarOpen()">
        <!-- Logo Section -->
        <div class="sidebar-header">
          <div class="logo-container">
            <div class="logo">
              <span class="logo-icon">🤖</span>
              <span class="logo-text" *ngIf="!sidebarCollapsed()">EconomyRPA</span>
            </div>
          </div>


        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav">
          <ul class="nav-list">
            <!-- Dashboard -->
            <li class="nav-item">
              <a
                routerLink="/home"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/home') ? 'page' : null"
              >
                <span class="material-symbols-outlined nav-icon">dashboard</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Dashboard</span>
              </a>
            </li>

            <!-- Business Units -->
            <li class="nav-item">
              <a
                routerLink="/business"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/business') ? 'page' : null"
              >
                <span class="material-symbols-outlined">corporate_fare</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Business Units</span>
              </a>
            </li>

            <!-- RPA Bots -->
            <li class="nav-item">
              <a
                routerLink="/rpabots"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/rpabots') ? 'page' : null"
              >
                <span class="material-symbols-outlined">smart_toy</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">RPA Bots</span>
              </a>
            </li>

            <!-- Business Processes -->
            <li class="nav-item">
              <a
                routerLink="/businessprocess"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/businessprocess') ? 'page' : null"
              >
                <span class="material-symbols-outlined">account_tree</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Processes</span>
              </a>
            </li>

            <!-- Configuration -->
            <li class="nav-item">
              <a
                routerLink="/config"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/config') ? 'page' : null"
              >
                <span class="material-symbols-outlined">settings</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Configuration</span>
              </a>
            </li>
          </ul>

          <!-- Navigation Sections Separator -->
          <div class="nav-separator" *ngIf="!sidebarCollapsed()"></div>

          <!-- Secondary Navigation -->
          <ul class="nav-list nav-secondary">
            <!-- Reports -->
            <li class="nav-item">
              <a
                routerLink="/reports"
                routerLinkActive="active"
                class="nav-link"
                [attr.aria-current]="isRouteActive('/reports') ? 'page' : null"
              >
                <span class="material-symbols-outlined">analytics</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Reports</span>
              </a>
            </li>

            <!-- Help -->
            <li class="nav-item">
              <a
                href="/help"
                class="nav-link"
                target="_blank"
              >
                <span class="material-symbols-outlined">help</span>
                <span class="nav-text" *ngIf="!sidebarCollapsed()">Help</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- User Section -->
        <div class="sidebar-footer" *ngIf="!sidebarCollapsed()">
          <div class="user-profile">
            <div class="user-avatar">
              <span class="avatar-text">{{ getUserInitial() }}</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{ getUser() || 'Loading...' }}</span>
              <span class="user-role">{{ formatUserRole(currentUser()?.role) }}</span>
            </div>
            <app-button
              variant="ghost"
              size="sm"
              (onClick)="logout()"
              class="logout-btn"
              title="Logout"
            >
              <span class="material-symbols-outlined">logout</span>🚪
            </app-button>
          </div>
        </div>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <div
        class="mobile-sidebar-overlay"
        *ngIf="mobileSidebarOpen()"
        (click)="closeMobileSidebar()"
      ></div>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
          <!-- Mobile Menu Toggle -->
          <button
            class="mobile-menu-toggle"
            (click)="openMobileSidebar()"
            [attr.aria-label]="mobileSidebarOpen() ? 'Close menu' : 'Open menu'"
            [attr.aria-expanded]="mobileSidebarOpen()"
          >
            <svg class="hamburger-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6" stroke-linecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke-linecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Sidebar Toggle (Desktop) -->
          <button
            class="sidebar-toggle desktop"
            (click)="toggleSidebar()"
            [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
            [attr.aria-expanded]="!sidebarCollapsed()"
            title="Toggle sidebar"
          >
            <svg class="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M15 18l-6-6 6-6"
                [class.rotated]="sidebarCollapsed()"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <!-- Page Title -->
          <div class="page-header">
            <h1 class="page-title">{{ currentPageTitle() }}</h1>
            <p class="page-subtitle">{{ currentPageSubtitle() }}</p>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <!-- Theme Toggle -->
            <app-button
              variant="ghost"
              size="sm"
              [iconRight]="isDarkTheme() ? '' : ''"
              (onClick)="toggleTheme()"
              title="Toggle theme"
            >
              <span class="material-symbols-outlined">
                {{ isDarkTheme() ? 'dark_mode' : 'light_mode' }}
              </span>
            </app-button>

            <!-- Notifications -->
            <button class="notification-btn" title="Notifications">
              <span class="material-symbols-outlined">notifications</span>
            </button>

            <!-- User Menu (Desktop) -->
            <div class="user-menu" *ngIf="currentUser()">
              <button
                class="user-menu-trigger"
                (click)="toggleUserMenu()"
                [attr.aria-expanded]="userMenuOpen()"
              >
                <span class="user-menu-avatar">{{ getUserInitial() }}</span>
                <span class="user-menu-name">{{ currentUser()?.fullName }}</span>
                <span class="user-menu-arrow">▼</span>
              </button>

              <div class="user-menu-dropdown" *ngIf="userMenuOpen()">
                <a href="/profile" class="user-menu-item">Profile</a>
                <a href="/settings" class="user-menu-item">Settings</a>
                <div class="user-menu-divider"></div>
                <button class="user-menu-item logout-item" (click)="logout()">
                  <span class="material-symbols-outlined">logout</span> Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="page-content">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  /** Estado del sidebar */
  private readonly _sidebarCollapsed = signal<boolean>(false);
  private readonly _mobileSidebarOpen = signal<boolean>(false);
  private readonly _userMenuOpen = signal<boolean>(false);

  /** Estados reactivos de servicios */
  readonly isDarkTheme = this.themeService.isDark;
  readonly currentUser = this.authService.currentUser;

  /** Computed signals */
  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();
  readonly mobileSidebarOpen = this._mobileSidebarOpen.asReadonly();
  readonly userMenuOpen = this._userMenuOpen.asReadonly();

  /** Page titles */
  readonly currentPageTitle = computed(() => {
    const url = this.router.url;
    if (url.includes('/home')) return 'Dashboard';
    if (url.includes('/business')) return 'Business Units';
    if (url.includes('/rpabots')) return 'RPA Bots';
    if (url.includes('/businessprocess')) return 'Business Processes';
    if (url.includes('/config')) return 'Configuration';
    if (url.includes('/reports')) return 'Reports';
    return 'EconomyRPA';
  });

  readonly currentPageSubtitle = computed(() => {
    const url = this.router.url;
    if (url.includes('/home')) return 'Monitor and manage your automation workflows';
    if (url.includes('/business')) return 'Manage business units and their processes';
    if (url.includes('/rpabots')) return 'Control and monitor your RPA bots';
    if (url.includes('/businessprocess')) return 'Define and manage business processes';
    if (url.includes('/config')) return 'Configure system settings and preferences';
    if (url.includes('/reports')) return 'View reports and analytics';
    return 'Welcome to EconomyRPA';
  });

  /** Métodos de navegación */
  isRouteActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  /** Métodos del sidebar */
  toggleSidebar(): void {
    this._sidebarCollapsed.update((collapsed: boolean) => !collapsed);
  }

  openMobileSidebar(): void {
    this._mobileSidebarOpen.set(true);
  }

  closeMobileSidebar(): void {
    this._mobileSidebarOpen.set(false);
  }

  /** Métodos del user menu */
  toggleUserMenu(): void {
    this._userMenuOpen.update((open: boolean) => !open);
  }

  closeUserMenu(): void {
    this._userMenuOpen.set(false);
  }

  /** Métodos de acciones */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
  }

  /** Métodos de utilidad */
  getUserInitial(): string {
    const user = this.currentUser();
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  getUser(): string {
    const user = this.currentUser();
    return user?.email ? user.email.split('@')[0] : 'Invitado';
  }

  formatUserRole(role?: string): string {
    if (!role) return 'User';
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /** Close dropdowns on outside click */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as Element;
    const userMenuElement = target.closest('.user-menu');

    if (!userMenuElement) {
      this.closeUserMenu();
    }
  }

  /** Handle escape key */
  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.closeMobileSidebar();
    this.closeUserMenu();
  }
}
