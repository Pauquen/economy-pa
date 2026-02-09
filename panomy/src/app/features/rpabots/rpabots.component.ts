import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, InputComponent, CardComponent } from '../../shared';
import type { RpaBot, RpaStatus, RpaTechnology } from '../../models';

/**
 * RpabotsComponent - Gestión de RPA Bots
 *
 * Standalone component con control de bots, logs y métricas
 * Real-time status updates y execution management
 */
@Component({
  selector: 'app-rpabots',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  template: `
    <div class="rpabots-container smooth-fade-in">
      <!-- Header -->
      <header class="rpabots-header">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">RPA Bots</h1>
            <p class="page-subtitle">
              Monitor and manage your automation workforce
            </p>
          </div>

          <div class="header-actions">
            <app-button
              variant="secondary"
              size="md"
              (onClick)="refreshAllBots()"
            >
              Refresh All
            </app-button>

            <app-button
              variant="primary"
              size="md"
              iconRight="➕"
              (onClick)="openCreateModal()"
            >
              New Bot
            </app-button>
          </div>
        </div>
      </header>

      <!-- Real-time Stats -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card running">
            <div class="stat-icon">🤖</div>
            <div class="stat-content">
              <span class="stat-number">{{ runningBots() }}</span>
              <span class="stat-label">Running</span>
            </div>
          </div>

          <div class="stat-card idle">
            <div class="stat-icon">⏸️</div>
            <div class="stat-content">
              <span class="stat-number">{{ idleBots() }}</span>
              <span class="stat-label">Idle</span>
            </div>
          </div>

          <div class="stat-card success">
            <div class="stat-icon">✅</div>
            <div class="stat-content">
              <span class="stat-number">{{ todayExecutions() }}</span>
              <span class="stat-label">Today's Executions</span>
            </div>
          </div>

          <div class="stat-card error">
            <div class="stat-icon">⚠️</div>
            <div class="stat-content">
              <span class="stat-number">{{ failedBots() }}</span>
              <span class="stat-label">Failed</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="quick-actions">
        <app-card variant="outlined" size="md" class="actions-card">
          <h3 class="actions-title">Quick Actions</h3>

          <div class="actions-grid">
            <button
              class="action-btn start-all"
              (click)="startAllIdleBots()"
              [disabled]="idleBots() === 0"
            >
              <span class="action-icon">▶️</span>
              <span>Start All Idle</span>
            </button>

            <button
              class="action-btn stop-all"
              (click)="stopAllRunningBots()"
              [disabled]="runningBots() === 0"
            >
              <span class="action-icon">⏹️</span>
              <span>Stop All Running</span>
            </button>

            <button
              class="action-btn restart-failed"
              (click)="restartFailedBots()"
              [disabled]="failedBots() === 0"
            >
              <span class="action-icon">🔄</span>
              <span>Restart Failed</span>
            </button>

            <button
              class="action-btn view-logs"
              (click)="viewAllLogs()"
            >
              <span class="action-icon">📋</span>
              <span>View All Logs</span>
            </button>
          </div>
        </app-card>
      </section>

      <!-- Search and Filters -->
      <section class="search-section">
        <div class="search-container">
          <app-input
            [(ngModel)]="searchTerm"
            [ngModelOptions]="{ standalone: true }"
            name="search"
            type="search"
            placeholder="Search RPA bots..."
            prefix="🔍"
            (ngModelChange)="onSearchChange($event)"
            size="lg"
          />

          <div class="filter-controls">
            <select
              class="filter-select"
              [value]="statusFilter()"
              (change)="onStatusFilterChange($any($event.target).value)"
            >
              <option value="">All Status</option>
              <option value="idle">Idle</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="paused">Paused</option>
              <option value="maintenance">Maintenance</option>
              <option value="disabled">Disabled</option>
            </select>

            <select
              class="filter-select"
              [value]="technologyFilter()"
              (change)="onTechnologyFilterChange($any($event.target).value)"
            >
              <option value="">All Technologies</option>
              <option value="ui_path">UiPath</option>
              <option value="automation_anywhere">Automation Anywhere</option>
              <option value="blue_prism">Blue Prism</option>
              <option value="microsoft_power_automate">Power Automate</option>
              <option value="python_selenium">Python Selenium</option>
              <option value="custom">Custom</option>
            </select>

            <app-button
              variant="secondary"
              size="md"
              (onClick)="resetFilters()"
            >
              Reset
            </app-button>
          </div>
        </div>
      </section>

      <!-- Bots Grid -->
      <main class="rpabots-main">
        @if (filteredBots().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🤖</div>
            <h3>No RPA bots found</h3>
            <p>Try adjusting your search or filters, or create a new bot.</p>
            <app-button
              variant="primary"
              size="md"
              (onClick)="openCreateModal()"
            >
              Create RPA Bot
            </app-button>
          </div>
        } @else {
          <div class="bots-grid">
            @for (bot of paginatedBots(); track bot.id) {
              <app-card
                [variant]="bot.status === 'running' ? 'elevated' : 'outlined'"
                size="lg"
                class="bot-card"
                [class]="bot.status"
              >
                <!-- Bot Header -->
                <div class="bot-header">
                  <div class="bot-info">
                    <h3 class="bot-name">{{ bot.name }}</h3>
                    <span class="bot-code">{{ bot.code }}</span>
                  </div>

                  <div class="bot-status">
                    <span class="status-indicator" [class]="bot.status"></span>
                    <span class="status-text">{{ bot.status }}</span>
                  </div>
                </div>

                <!-- Bot Technology -->
                <div class="bot-technology">
                  <span class="tech-badge">{{ getTechnologyLabel(bot.technology) }}</span>
                </div>

                <!-- Bot Metrics -->
                <div class="bot-metrics">
                  <div class="metric-item">
                    <span class="metric-label">Executions</span>
                    <span class="metric-value">{{ bot.metrics.totalExecutions }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Success Rate</span>
                    <span class="metric-value">{{ getSuccessRate(bot) }}%</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">Avg Time</span>
                    <span class="metric-value">{{ formatTime(bot.metrics.avgExecutionTime) }}</span>
                  </div>
                </div>

                <!-- Last Execution -->
                @if (bot.metrics.lastExecutionAt) {
                  <div class="last-execution">
                    <span class="execution-label">Last:</span>
                    <span class="execution-time">{{ formatRelativeTime(bot.metrics.lastExecutionAt) }}</span>
                  </div>
                }

                <!-- Bot Actions -->
                <div class="bot-actions">
                  @switch (bot.status) {
                    @case ('idle') {
                      <app-button
                        variant="primary"
                        size="sm"
                        (onClick)="startBot(bot)"
                      >
                        Start
                      </app-button>
                    }

                    @case ('running') {
                      <app-button
                        variant="secondary"
                        size="sm"
                        (onClick)="stopBot(bot)"
                      >
                        Stop
                      </app-button>
                    }

                    @case ('failed') {
                      <app-button
                        variant="primary"
                        size="sm"
                        (onClick)="restartBot(bot)"
                      >
                        Restart
                      </app-button>
                    }

                    @case ('paused') {
                      <app-button
                        variant="primary"
                        size="sm"
                        (onClick)="resumeBot(bot)"
                      >
                        Resume
                      </app-button>
                    }
                  }

                  <app-button
                    variant="ghost"
                    size="sm"
                    (onClick)="viewBotDetails(bot)"
                  >
                    Details
                  </app-button>

                  <app-button
                    variant="ghost"
                    size="sm"
                    (onClick)="viewBotLogs(bot)"
                  >
                    Logs
                  </app-button>
                </div>
              </app-card>
            }
          </div>

          <!-- Pagination -->
          @if (filteredBots().length > pageSize()) {
            <div class="pagination">
              <div class="pagination-info">
                Showing {{ (currentPage() - 1) * pageSize() + 1 }} to
                {{ min(currentPage() * pageSize(), filteredBots().length) }}
                of {{ filteredBots().length }} bots
              </div>

              <div class="pagination-controls">
                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="currentPage() === 1"
                  (onClick)="previousPage()"
                >
                  Previous
                </app-button>

                <span class="page-info">
                  Page {{ currentPage() }} of {{ totalPages() }}
                </span>

                <app-button
                  variant="secondary"
                  size="sm"
                  [disabled]="currentPage() === totalPages()"
                  (onClick)="nextPage()"
                >
                  Next
                </app-button>
              </div>
            </div>
          }
        }
      </main>

      <!-- Create/Edit Modal (placeholder) -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3>{{ modalMode() === 'create' ? 'Create' : 'Edit' }} RPA Bot</h3>
            <p>Bot configuration modal to be implemented</p>
            <app-button variant="secondary" (click)="closeModal()">Close</app-button>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./rpabots.component.scss']
})
export class RpabotsComponent implements OnInit {
  private readonly router = inject(Router);

  /** Mock RPA bots data */
  private readonly _rpaBots = signal<RpaBot[]>([
    {
      id: 'bot_001',
      name: 'Invoice Processor',
      code: 'INV_PROC_001',
      description: 'Automates invoice processing and data extraction',
      technology: 'ui_path',
      status: 'running',
      processId: 'proc_001',
      configuration: {
        executionSchedule: '0 6 * * 1-5', // Weekdays at 6 AM
        retryAttempts: 3,
        timeoutMinutes: 30,
        maxMemoryMB: 512
      },
      metrics: {
        totalExecutions: 1245,
        successfulExecutions: 1198,
        failedExecutions: 47,
        avgExecutionTime: 145,
        lastExecutionAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        lastSuccessAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      recentLogs: [],
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    },
    {
      id: 'bot_002',
      name: 'Data Sync Master',
      code: 'DATA_SYNC_002',
      description: 'Synchronizes data between multiple systems',
      technology: 'python_selenium',
      status: 'idle',
      processId: 'proc_002',
      configuration: {
        retryAttempts: 2,
        timeoutMinutes: 45,
        maxMemoryMB: 256
      },
      metrics: {
        totalExecutions: 892,
        successfulExecutions: 845,
        failedExecutions: 47,
        avgExecutionTime: 89,
        lastExecutionAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastSuccessAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      recentLogs: [],
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-19T00:00:00Z'
    },
    {
      id: 'bot_003',
      name: 'Email Handler Pro',
      code: 'EMAIL_PROC_003',
      description: 'Processes incoming emails and extracts attachments',
      technology: 'automation_anywhere',
      status: 'failed',
      processId: 'proc_003',
      configuration: {
        retryAttempts: 5,
        timeoutMinutes: 20,
        maxMemoryMB: 384
      },
      metrics: {
        totalExecutions: 2341,
        successfulExecutions: 2187,
        failedExecutions: 154,
        avgExecutionTime: 67,
        lastExecutionAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lastFailureAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      recentLogs: [],
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-18T00:00:00Z'
    },
    {
      id: 'bot_004',
      name: 'Report Generator',
      code: 'REPORT_GEN_004',
      description: 'Generates automated reports from database data',
      technology: 'microsoft_power_automate',
      status: 'paused',
      processId: 'proc_004',
      configuration: {
        executionSchedule: '0 8 * * 1-5',
        retryAttempts: 2,
        timeoutMinutes: 60,
        maxMemoryMB: 1024
      },
      metrics: {
        totalExecutions: 456,
        successfulExecutions: 445,
        failedExecutions: 11,
        avgExecutionTime: 234,
        lastExecutionAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        lastSuccessAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      recentLogs: [],
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-17T00:00:00Z'
    },
    {
      id: 'bot_005',
      name: 'Customer Data Validator',
      code: 'CUST_VALID_005',
      description: 'Validates and cleans customer data from various sources',
      technology: 'blue_prism',
      status: 'completed',
      processId: 'proc_005',
      configuration: {
        retryAttempts: 1,
        timeoutMinutes: 90,
        maxMemoryMB: 768
      },
      metrics: {
        totalExecutions: 78,
        successfulExecutions: 78,
        failedExecutions: 0,
        avgExecutionTime: 456,
        lastExecutionAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        lastSuccessAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      recentLogs: [],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    }
  ]);

  /** Estado de filtros y paginación */
  private readonly _searchTerm = signal<string>('');
  private readonly _statusFilter = signal<string>('');
  private readonly _technologyFilter = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = 9;

  /** Estado del modal */
  private readonly _showModal = signal<boolean>(false);
  private readonly _modalMode = signal<'create' | 'edit'>('create');
  private readonly _selectedBot = signal<RpaBot | null>(null);

  /** Computed signals */
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly statusFilter = this._statusFilter.asReadonly();
  readonly technologyFilter = this._technologyFilter.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly showModal = this._showModal.asReadonly();
  readonly modalMode = this._modalMode.asReadonly();

  readonly rpaBots = this._rpaBots.asReadonly();

  readonly filteredBots = computed(() => {
    let bots = this._rpaBots();

    // Apply search filter
    if (this._searchTerm()) {
      const term = this._searchTerm().toLowerCase();
      bots = bots.filter(bot =>
        bot.name.toLowerCase().includes(term) ||
        bot.code.toLowerCase().includes(term) ||
        bot.description?.toLowerCase().includes(term) ||
        bot.technology.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this._statusFilter()) {
      bots = bots.filter(bot => bot.status === this._statusFilter());
    }

    // Apply technology filter
    if (this._technologyFilter()) {
      bots = bots.filter(bot => bot.technology === this._technologyFilter());
    }

    return bots;
  });

  readonly paginatedBots = computed(() => {
    const bots = this.filteredBots();
    const start = (this._currentPage() - 1) * this._pageSize;
    const end = start + this._pageSize;
    return bots.slice(start, end);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredBots().length / this._pageSize);
  });

  readonly pageSize = () => this._pageSize;

  /** Stats computed */
  readonly runningBots = computed(() =>
    this._rpaBots().filter(bot => bot.status === 'running').length
  );
  readonly idleBots = computed(() =>
    this._rpaBots().filter(bot => bot.status === 'idle').length
  );
  readonly failedBots = computed(() =>
    this._rpaBots().filter(bot => bot.status === 'failed').length
  );
  readonly todayExecutions = computed(() => {
    const today = new Date().toDateString();
    return this._rpaBots()
      .filter(bot => bot.metrics.lastExecutionAt)
      .filter(bot => new Date(bot.metrics.lastExecutionAt!).toDateString() === today)
      .length;
  });

  /** Lifecycle */
  ngOnInit(): void {
    // Iniciar actualizaciones periódicas (simuladas)
    this.startRealTimeUpdates();
  }

  /** Métodos de búsqueda y filtros */
  onSearchChange(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1);
  }

  onStatusFilterChange(status: string): void {
    this._statusFilter.set(status);
    this._currentPage.set(1);
  }

  onTechnologyFilterChange(technology: string): void {
    this._technologyFilter.set(technology);
    this._currentPage.set(1);
  }

  resetFilters(): void {
    this._searchTerm.set('');
    this._statusFilter.set('');
    this._technologyFilter.set('');
    this._currentPage.set(1);
  }

  /** Métodos de paginación */
  nextPage(): void {
    if (this._currentPage() < this.totalPages()) {
      this._currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this._currentPage() > 1) {
      this._currentPage.update(page => page - 1);
    }
  }

  /** Métodos de control de bots */
  startBot(bot: RpaBot): void {
    this.updateBotStatus(bot.id, 'running');
    console.log(`Starting bot: ${bot.name}`);
  }

  stopBot(bot: RpaBot): void {
    this.updateBotStatus(bot.id, 'idle');
    console.log(`Stopping bot: ${bot.name}`);
  }

  restartBot(bot: RpaBot): void {
    this.updateBotStatus(bot.id, 'running');
    console.log(`Restarting bot: ${bot.name}`);
  }

  resumeBot(bot: RpaBot): void {
    this.updateBotStatus(bot.id, 'running');
    console.log(`Resuming bot: ${bot.name}`);
  }

  startAllIdleBots(): void {
    this._rpaBots.update(bots =>
      bots.map(bot =>
        bot.status === 'idle' ? { ...bot, status: 'running' as RpaStatus } : bot
      )
    );
  }

  stopAllRunningBots(): void {
    this._rpaBots.update(bots =>
      bots.map(bot =>
        bot.status === 'running' ? { ...bot, status: 'idle' as RpaStatus } : bot
      )
    );
  }

  restartFailedBots(): void {
    this._rpaBots.update(bots =>
      bots.map(bot =>
        bot.status === 'failed' ? { ...bot, status: 'running' as RpaStatus } : bot
      )
    );
  }

  /** Métodos de vista */
  viewBotDetails(bot: RpaBot): void {
    this.router.navigate(['/rpabots', bot.id]);
  }

  viewBotLogs(bot: RpaBot): void {
    this.router.navigate(['/rpabots', bot.id, 'logs']);
  }

  viewAllLogs(): void {
    this.router.navigate(['/rpabots', 'logs']);
  }

  refreshAllBots(): void {
    console.log('Refreshing all RPA bots...');
  }

  /** Métodos de modal */
  openCreateModal(): void {
    this._selectedBot.set(null);
    this._modalMode.set('create');
    this._showModal.set(true);
  }

  closeModal(): void {
    this._showModal.set(false);
    this._selectedBot.set(null);
  }

  /** Métodos de utilidad */
  getTechnologyLabel(technology: RpaTechnology): string {
    const labels: Record<RpaTechnology, string> = {
      ui_path: 'UiPath',
      automation_anywhere: 'AA',
      blue_prism: 'Blue Prism',
      microsoft_power_automate: 'Power Automate',
      python_selenium: 'Python',
      custom: 'Custom'
    };
    return labels[technology] || technology;
  }

  getSuccessRate(bot: RpaBot): number {
    if (bot.metrics.totalExecutions === 0) return 0;
    return Math.round((bot.metrics.successfulExecutions / bot.metrics.totalExecutions) * 100);
  }

  formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }

  formatRelativeTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  /** Métodos privados */
  private updateBotStatus(botId: string, status: RpaStatus): void {
    this._rpaBots.update(bots =>
      bots.map(bot =>
        bot.id === botId ? { ...bot, status } : bot
      )
    );
  }

  private startRealTimeUpdates(): void {
    // Simular actualizaciones cada 15 segundos
    setInterval(() => {
      this.simulateStatusChanges();
    }, 15000);
  }

  private simulateStatusChanges(): void {
    // Simular cambios aleatorios en el estado de los bots
    const randomIndex = Math.floor(Math.random() * this._rpaBots().length);
    const bot = this._rpaBots()[randomIndex];

    if (bot.status === 'running') {
      // Random chance to complete
      if (Math.random() > 0.7) {
        this.updateBotStatus(bot.id, 'completed');
        setTimeout(() => {
          this.updateBotStatus(bot.id, 'idle');
        }, 5000);
      }
    } else if (bot.status === 'idle') {
      // Random chance to start
      if (Math.random() > 0.9) {
        this.updateBotStatus(bot.id, 'running');
      }
    } else if (bot.status === 'failed') {
      // Random chance to auto-restart
      if (Math.random() > 0.8) {
        this.updateBotStatus(bot.id, 'running');
      }
    }
  }
}
