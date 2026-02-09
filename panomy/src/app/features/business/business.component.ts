import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ButtonComponent, InputComponent, CardComponent } from '../../shared';
import { BusinessService } from '../../services/business.service';
import type { BusinessUnit, User } from '../../models';

/**
 * BusinessComponent - Gestión de Unidades de Negocio
 * 
 * Standalone component con CRUD operations y data tables
 * Search, filter, pagination con Signals y smooth interactions
 */
@Component({
  selector: 'app-business',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly businessService = inject(BusinessService);

  /** Estado de filtros y ordenamiento */
  private readonly _searchTerm = signal<string>('');
  private readonly _statusFilter = signal<string>('');
  private readonly _sortField = signal<keyof BusinessUnit>('name');
  private readonly _sortDirection = signal<'asc' | 'desc'>('asc');
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = 10;

  /** Estado del modal */
  private readonly _showModal = signal<boolean>(false);
  private readonly _modalMode = signal<'create' | 'edit'>('create');
  private readonly _selectedUnit = signal<BusinessUnit | null>(null);

  /** Computed signals */
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly statusFilter = this._statusFilter.asReadonly();
  readonly sortField = this._sortField.asReadonly();
  readonly sortDirection = this._sortDirection.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly showModal = this._showModal.asReadonly();
  readonly modalMode = this._modalMode.asReadonly();

  /** Business units from service */
  readonly businessUnits = this.businessService.businessUnits;
  readonly isLoading = this.businessService.isLoading;
  readonly error = this.businessService.error;

  readonly filteredUnits = computed(() => {
    let units = this.businessUnits();
    
    // Apply search filter
    if (this._searchTerm()) {
      const term = this._searchTerm().toLowerCase();
      units = units.filter(unit => 
        unit.name.toLowerCase().includes(term) ||
        unit.code.toLowerCase().includes(term) ||
        unit.description?.toLowerCase().includes(term) ||
        unit.manager?.fullName.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (this._statusFilter()) {
      units = units.filter(unit => unit.status === this._statusFilter());
    }
    
    // Apply sorting
    units = [...units].sort((a: BusinessUnit, b: BusinessUnit) => {
      const field = this._sortField();
      const direction = this._sortDirection();
      
      let aValue: any = a[field];
      let bValue: any = b[field];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return units;
  });

  readonly paginatedUnits = computed(() => {
    const units = this.filteredUnits();
    const start = (this._currentPage() - 1) * this._pageSize;
    const end = start + this._pageSize;
    return units.slice(start, end);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredUnits().length / this._pageSize);
  });

  readonly pageSize = () => this._pageSize;

  /** Stats computed */
  readonly totalUnits = computed(() => this.businessUnits().length);
  readonly activeUnits = computed(() => 
    this.businessUnits().filter((unit: BusinessUnit) => unit.status === 'active').length
  );
  readonly totalProcesses = computed(() => 
    this.businessUnits().reduce((sum: number, unit: BusinessUnit) => sum + unit.metrics.totalProcesses, 0)
  );
  readonly totalSavings = computed(() => {
    const total = this.businessUnits().reduce((sum: number, unit: BusinessUnit) => sum + unit.metrics.monthlySavings, 0);
    return this.formatNumber(total);
  });

  /** Lifecycle */
  ngOnInit(): void {
    // Cargar datos del servicio
    this.businessService.getBusinessUnits().subscribe({
      error: (error) => {
        console.error('Error loading business units:', error);
      }
    });
  }

  /** Métodos de búsqueda y filtros */
  onSearchChange(term: string): void {
    this._searchTerm.set(term);
    this._currentPage.set(1); // Reset to first page
  }

  onStatusFilterChange(status: string): void {
    this._statusFilter.set(status);
    this._currentPage.set(1);
  }

  resetFilters(): void {
    this._searchTerm.set('');
    this._statusFilter.set('');
    this._currentPage.set(1);
  }

  /** Métodos de ordenamiento */
  sortBy(field: keyof BusinessUnit): void {
    if (this._sortField() === field) {
      this._sortDirection.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this._sortField.set(field);
      this._sortDirection.set('asc');
    }
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

  /** Métodos CRUD */
  viewUnit(unit: BusinessUnit): void {
    // Navegar a detalles de la unidad
    this.router.navigate(['/business', unit.id]);
  }

  editUnit(unit: BusinessUnit): void {
    this._selectedUnit.set(unit);
    this._modalMode.set('edit');
    this._showModal.set(true);
  }

  openCreateModal(): void {
    this._selectedUnit.set(null);
    this._modalMode.set('create');
    this._showModal.set(true);
  }

  archiveUnit(unit: BusinessUnit): void {
    if (confirm(`Are you sure you want to archive "${unit.name}"?`)) {
      // Update unit status using service
      this.businessService.archiveBusinessUnit(unit.id).subscribe({
        error: (error) => {
          console.error('Failed to archive unit:', error);
          // Handle error appropriately in UI
        }
      });
    }
  }

  closeModal(): void {
    this._showModal.set(false);
    this._selectedUnit.set(null);
  }

  refreshData(): void {
    // Recargar datos del servicio
    this.businessService.refresh();
  }

  /** Métodos de utilidad */
  formatNumber(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  }

  getEfficiencyClass(efficiency: number): string {
    if (efficiency >= 90) return 'excellent';
    if (efficiency >= 75) return 'good';
    if (efficiency >= 60) return 'fair';
    return 'poor';
  }

  formatSavings(amount: number): string {
    return '$' + this.formatNumber(amount);
  }

  formatTotalSavings(): string {
    return '$' + this.totalSavings();
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}