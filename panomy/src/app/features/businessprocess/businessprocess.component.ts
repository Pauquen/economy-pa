import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, InputComponent } from '../../shared';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import type { 
  BusinessProcess, 
  ProcessCategory, 
  ProcessPriority, 
  ProcessStatus 
} from '../../models';

/**
 * BusinessprocessComponent - Gestión de Procesos de Negocio
 * 
 * Standalone component para administración de procesos
 * CRUD operations, filters, search y workflow management
 */
@Component({
  selector: 'app-businessprocess',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ButtonComponent,
    InputComponent
  ],
  templateUrl: './businessprocess.component.html',
  styleUrls: ['./businessprocess.component.scss']
})
export class BusinessprocessComponent {
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly authService = inject(AuthService);

  readonly isDarkTheme = this.themeService.isDark;

  // Search and filter signals
  searchQuery = signal('');
  selectedCategory = signal('');
  selectedStatus = signal('');
  selectedPriority = signal('');

  // Mock data - in real app this would come from API
  readonly processes = signal<BusinessProcess[]>([
    {
      id: '1',
      name: 'Invoice Processing',
      code: 'INV-001',
      description: 'Automated invoice validation and payment processing',
      businessUnitId: 'bu-001',
      category: 'finance',
      status: 'active',
      priority: 'high',
      rpaBotIds: ['bot-001', 'bot-002'],
      metrics: {
        avgExecutionTime: 15,
        successRate: 98,
        monthlyExecutions: 150,
        errorRate: 2,
        costSavings: 5000
      },
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Employee Onboarding',
      code: 'HR-001',
      description: 'Complete new employee setup and documentation',
      businessUnitId: 'bu-002',
      category: 'hr',
      status: 'active',
      priority: 'medium',
      rpaBotIds: ['bot-003'],
      metrics: {
        avgExecutionTime: 45,
        successRate: 92,
        monthlyExecutions: 25,
        errorRate: 8,
        costSavings: 3000
      },
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Customer Support Routing',
      code: 'CS-001',
      description: 'Intelligent ticket routing and escalation',
      businessUnitId: 'bu-003',
      category: 'customer_service',
      status: 'testing',
      priority: 'critical',
      rpaBotIds: ['bot-004'],
      metrics: {
        avgExecutionTime: 5,
        successRate: 88,
        monthlyExecutions: 800,
        errorRate: 12,
        costSavings: 2000
      },
      createdAt: '2024-01-12',
      updatedAt: '2024-01-19'
    },
    {
      id: '4',
      name: 'Inventory Reconciliation',
      code: 'OPS-001',
      description: 'Daily stock level verification and ordering',
      businessUnitId: 'bu-001',
      category: 'operations',
      status: 'active',
      priority: 'medium',
      rpaBotIds: ['bot-005', 'bot-006'],
      metrics: {
        avgExecutionTime: 30,
        successRate: 95,
        monthlyExecutions: 30,
        errorRate: 5,
        costSavings: 4000
      },
      createdAt: '2024-01-08',
      updatedAt: '2024-01-17'
    },
    {
      id: '5',
      name: 'Security Compliance Check',
      code: 'IT-001',
      description: 'Automated security audit and compliance verification',
      businessUnitId: 'bu-004',
      category: 'it',
      status: 'testing',
      priority: 'high',
      rpaBotIds: [],
      metrics: {
        avgExecutionTime: 60,
        successRate: 0,
        monthlyExecutions: 0,
        errorRate: 0,
        costSavings: 0
      },
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14'
    },
    {
      id: '6',
      name: 'Payroll Processing',
      code: 'HR-002',
      description: 'Monthly payroll calculation and distribution',
      businessUnitId: 'bu-002',
      category: 'hr',
      status: 'maintenance',
      priority: 'critical',
      rpaBotIds: ['bot-007'],
      metrics: {
        avgExecutionTime: 90,
        successRate: 99,
        monthlyExecutions: 12,
        errorRate: 1,
        costSavings: 8000
      },
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    }
  ]);

  // Computed signals for filtering and stats
  readonly filteredProcesses = computed(() => {
    let filtered = this.processes();
    
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(process => 
        process.name.toLowerCase().includes(query) ||
        (process.description && process.description.toLowerCase().includes(query))
      );
    }
    
    if (this.selectedCategory()) {
      filtered = filtered.filter(process => 
        process.category === this.selectedCategory()
      );
    }
    
    if (this.selectedStatus()) {
      filtered = filtered.filter(process => 
        process.status === this.selectedStatus()
      );
    }
    
    if (this.selectedPriority()) {
      filtered = filtered.filter(process => 
        process.priority === this.selectedPriority()
      );
    }
    
    return filtered;
  });

  readonly totalProcesses = computed(() => this.processes().length);
  
  readonly activeProcesses = computed(() => 
    this.processes().filter(p => p.status === 'active').length
  );
  
  readonly automatedProcesses = computed(() => 
    this.processes().filter(p => p.status === 'active').length
  );
  
  readonly averageEfficiency = computed(() => {
    const activeProcesses = this.processes().filter(p => p.status === 'active');
    if (activeProcesses.length === 0) return 0;
    
    const totalSuccessRate = activeProcesses.reduce((sum, p) => sum + p.metrics.successRate, 0);
    return Math.round(totalSuccessRate / activeProcesses.length);
  });

  /**
   * Handle search input changes
   */
  onSearchChange(): void {
    // Search is reactive through computed signal
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    // Filters are reactive through computed signal
  }

  /**
   * Create new process
   */
  createNewProcess(): void {
    // Navigate to process creation page or open modal
    this.router.navigate(['/businessprocess/create']);
  }

  /**
   * Import process
   */
  importProcess(): void {
    alert('Process import feature coming soon!');
  }

  /**
   * View process details
   */
  viewProcessDetails(processId: string): void {
    this.router.navigate([`/businessprocess/${processId}`]);
  }

  /**
   * Edit process
   */
  editProcess(processId: string): void {
    this.router.navigate([`/businessprocess/${processId}/edit`]);
  }

  /**
   * Run process
   */
  runProcess(processId: string): void {
    alert(`Running process ${processId}`);
    // In real app: call API to start process execution
  }

  /**
   * Pause process
   */
  pauseProcess(processId: string): void {
    alert(`Pausing process ${processId}`);
    // In real app: call API to pause process
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category: ProcessCategory): string {
    const icons: Record<ProcessCategory, string> = {
      finance: '💰',
      hr: '👥',
      operations: '⚙️',
      customer_service: '🎯',
      it: '💻',
      compliance: '🔒',
      other: '📋'
    };
    return icons[category] || '📋';
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: ProcessStatus): string {
    const icons: Record<ProcessStatus, string> = {
      active: '✅',
      inactive: '⏹️',
      testing: '🧪',
      maintenance: '🔧',
      deprecated: '📦'
    };
    return icons[status] || '❓';
  }

  /**
   * Get priority icon
   */
  getPriorityIcon(priority: ProcessPriority): string {
    const icons = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🟢'
    };
    return icons[priority] || '⚪';
  }

  /**
   * Get priority class for styling
   */
  getPriorityClass(priority: ProcessPriority): string {
    return `priority-${priority}`;
  }

  /**
   * Get success rate class for styling
   */
  getSuccessRateClass(successRate: number): string {
    if (successRate >= 95) return 'success-excellent';
    if (successRate >= 85) return 'success-good';
    if (successRate >= 70) return 'success-fair';
    return 'success-poor';
  }
}