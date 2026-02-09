import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonComponent } from '../../shared';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

/**
 * ConfigComponent - System Configuration Panel
 * 
 * Clean separation: HTML (structure) + SCSS (styles) + TS (logic)
 * Handles user profile, preferences, security, and API settings
 */
@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    FormsModule,
    ButtonComponent
  ],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent {
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  // UI State
  readonly isSaving = signal(false);
  readonly activeTab = signal<'profile' | 'preferences' | 'security' | 'api'>('profile');
  readonly selectedAccentColor = signal<string>('#3b82f6');

  // Color Options
  readonly accentColors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#8b5cf6', // purple
    '#f59e0b', // orange
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316'  // orange-red
  ];

  // User Profile Data
  readonly userProfile = {
    fullName: signal('John Doe'),
    email: signal('john.doe@economyrpa.com'),
    phone: signal('+1 (555) 123-4567'),
    department: signal('IT'),
    bio: signal('Senior RPA Developer with expertise in business process automation.')
  };

  // User Preferences
  readonly userPreferences = {
    theme: signal<'light' | 'dark' | 'auto'>('auto'),
    language: signal('en'),
    timezone: signal('America/New_York')
  };

  // Security Settings
  readonly securitySettings = {
    twoFactorEnabled: signal(true),
    sessionTimeout: signal(true),
    profileVisibility: signal(false),
    activityTracking: signal(true)
  };

  constructor() {
    this.loadUserData();
  }

  // Tab Management
  setActiveTab(tab: 'profile' | 'preferences' | 'security' | 'api'): void {
    this.activeTab.set(tab);
  }

  // Profile Methods
  getAvatarInitials(): string {
    const name = this.userProfile.fullName() || 'User';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  changeAvatar(): void {
    console.log('Change avatar clicked');
    // In real app: open file picker or avatar selector
  }

  // Theme Methods
  setAccentColor(color: string): void {
    this.selectedAccentColor.set(color);
    this.applyAccentColor(color);
  }

  private applyAccentColor(color: string): void {
    document.documentElement.style.setProperty('--accent-primary', color);
  }

  // Security Methods
  getSecurityScore(): number {
    let score = 50; // Base score
    
    if (this.securitySettings.twoFactorEnabled()) score += 20;
    if (this.securitySettings.sessionTimeout()) score += 15;
    if (this.securitySettings.profileVisibility()) score -= 10;
    if (this.securitySettings.activityTracking()) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  // API Methods
  copyApiKey(type: 'production' | 'development'): void {
    const apiKey = type === 'production' 
      ? 'prod_key_1234567890abcdef' 
      : 'dev_key_0987654321fedcba';
    
    navigator.clipboard.writeText(apiKey).then(() => {
      console.log(`${type} API key copied to clipboard`);
    });
  }

  regenerateApiKey(type: 'production' | 'development'): void {
    console.log(`Regenerating ${type} API key`);
    // In real app: call API to regenerate key
  }

  // Settings Actions
  async saveAllSettings(): Promise<void> {
    this.isSaving.set(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save preferences to theme service
      const isDark = this.userPreferences.theme() === 'dark';
      this.themeService.setTheme(isDark);
      
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  resetAllSettings(): void {
    console.log('Reset all settings clicked');
    // In real app: reset to defaults with confirmation
  }

  // Private Methods
  private loadUserData(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.userProfile.fullName.set(currentUser.fullName || 'John Doe');
      this.userProfile.email.set(currentUser.email || 'user@example.com');
    }
  }
}