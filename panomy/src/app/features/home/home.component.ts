import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CardComponent } from '../../shared';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import type { User, RpaDashboardMetrics } from '../../models';

/**
 * HomeComponent - Dashboard Principal
 *
 * Standalone component con widgets de métricas
 * Real-time updates con Signals y smooth animations
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    ButtonComponent,
    CardComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  search: string = '';
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Estados reactivos */
  readonly isDarkTheme = this.themeService.isDark;
  readonly currentUser = this.authService.currentUser;

  /** Mock dashboard metrics */
  private readonly _dashboardMetrics = signal<RpaDashboardMetrics>({
    totalBots: 12,
    botsByStatus: {
      idle: 3,
      running: 5,
      completed: 4,
      failed: 0,
      paused: 0,
      maintenance: 0,
      disabled: 0
    },
    executions24h: {
      total: 245,
      successful: 231,
      failed: 14,
      successRate: 94.3
    },
    avgExecutionTime: 3.2,
    monthlyCostSavings: 15680,
    executionTrend: []
  });

  /** Chart bar heights estáticos para evitar NG0100 */
  readonly chartBarHeights = signal<number[]>([]);

  /** Mock recent activity */
  private readonly _recentActivity = signal([
    {
      id: '1',
      title: 'Data Import Bot Completed',
      description: 'Successfully processed 1,250 records from ERP system',
      icon: '✅',
      status: 'success',
      timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 min ago
    },
    {
      id: '2',
      title: 'Invoice Processing Started',
      description: 'Processing 47 pending invoices from accounting',
      icon: '🤖',
      status: 'running',
      timestamp: new Date(Date.now() - 25 * 60 * 1000) // 25 min ago
    },
    {
      id: '3',
      title: 'Report Generation Failed',
      description: 'Monthly report bot encountered a timeout error',
      icon: '⚠️',
      status: 'error',
      timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 min ago
    }
  ]);

  /** Mock top performers */
  private readonly _topPerformers = signal([
    { id: '1', name: 'Invoice Processor', processName: 'Finance', successRate: 98.5 },
    { id: '2', name: 'Data Sync Bot', processName: 'Operations', successRate: 96.2 },
    { id: '3', name: 'Email Handler', processName: 'Customer Service', successRate: 94.8 },
    { id: '4', name: 'Backup Automator', processName: 'IT', successRate: 99.1 }
  ]);

  /** Computed signals */
  readonly userDisplayName = computed(() => {
    const user = this.authService.currentUser();
    return user?.email ? user.email.split('@')[0] : 'Invitado';
  });

  readonly dashboardStats = computed(() => {
    const metrics = this._dashboardMetrics();

    return [
      {
        id: 'bots',
        label: 'Active Bots',
        value: metrics.botsByStatus.running + metrics.botsByStatus.idle,
        icon: '🤖',
        trend: 12.5
      },
      {
        id: 'executions',
        label: '24h Executions',
        value: metrics.executions24h.total,
        icon: '⚡',
        trend: 8.3
      },
      {
        id: 'success-rate',
        label: 'Success Rate',
        value: metrics.executions24h.successRate,
        icon: '📈',
        trend: 2.1
      },
      {
        id: 'savings',
        label: 'Monthly Savings',
        value: metrics.monthlyCostSavings,
        icon: '💰',
        trend: 15.7
      }
    ];
  });

  readonly recentActivity = this._recentActivity.asReadonly();
  readonly topPerformers = this._topPerformers.asReadonly();

  /** Lifecycle */
  ngOnInit(): void {
    // Generar alturas estáticas para el chart (evita NG0100)
    this.chartBarHeights.set([65, 80, 45, 90, 75, 55, 85]);

    // Iniciar actualizaciones periódicas (simuladas)
    this.startPeriodicUpdates();
  }

  /** Métodos públicos */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  navigateToRpaBots(): void {
    this.router.navigate(['/rpabots']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  refreshActivity(): void {
    // Simular refresh de actividad
    const newActivity = {
      id: Date.now().toString(),
      title: 'Manual Refresh',
      description: 'Dashboard data refreshed successfully',
      icon: '🔄',
      status: 'success',
      timestamp: new Date()
    };

    this._recentActivity.update((activities: any[]) => [newActivity, ...activities.slice(0, 4)]);
  }

  /** Métodos de formato */
  formatNumber(value: number | string): string {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toString();
    }
    return value;
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (minutes < 1440) { // 24 hours
      return `${Math.floor(minutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getRandomBarHeight(): number {
    // Mock heights para el chart
    return [65, 80, 45, 90, 75, 55, 85][Math.floor(Math.random() * 7)];
  }

  /** Métodos privados */
  private startPeriodicUpdates(): void {
    // Simular actualizaciones cada 30 segundos
    setInterval(() => {
      this.updateMetrics();
    }, 30000);
  }

  private updateMetrics(): void {
    // Simular cambios en métricas
    this._dashboardMetrics.update((metrics: any) => ({
      ...metrics,
      executions24h: {
        ...metrics.executions24h,
        total: metrics.executions24h.total + Math.floor(Math.random() * 10),
        successful: metrics.executions24h.successful + Math.floor(Math.random() * 8),
      }
    }));
  }
}
