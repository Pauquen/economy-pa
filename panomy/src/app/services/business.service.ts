import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import type { BusinessUnit, User } from '../models';

/**
 * BusinessService - Service for managing business units data
 * 
 * Handles API calls, data transformation, and business logic for business units
 * Following the Smart/Dumb component pattern
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private readonly http = inject(HttpClient);
  
  /** Mock API endpoint - replace with real endpoint */
  private readonly API_URL = 'http://127.0.0.1:8000/';
  
  /** Internal cache/signal for business units */
  private readonly _businessUnits = signal<BusinessUnit[]>([]);
  
  /** Loading state signal */
  private readonly _isLoading = signal<boolean>(false);
  
  /** Error state signal */
  private readonly _error = signal<string | null>(null);

  /** Public readonly signals */
  readonly businessUnits = this._businessUnits.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // Initialize with mock data for development
    this.initializeMockData();
  }

  /**
   * Get all business units
   */
  getBusinessUnits(): Observable<BusinessUnit[]> {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulate API call with mock data
    return of(this._businessUnits()).pipe(
      delay(500), // Simulate network latency
      map(units => {
        this._isLoading.set(false);
        return units;
      })
    );

    // Real API call would look like:
    // return this.http.get<BusinessUnit[]>(this.API_URL).pipe(
    //   catchError(error => {
    //     this._error.set('Failed to load business units');
    //     this._isLoading.set(false);
    //     return throwError(() => error);
    //   }),
    //   map(units => {
    //     this._businessUnits.set(units);
    //     this._isLoading.set(false);
    //     return units;
    //   })
    // );
  }

  /**
   * Get business unit by ID
   */
  getBusinessUnitById(id: string): Observable<BusinessUnit | null> {
    const unit = this._businessUnits().find(u => u.id === id);
    return of(unit || null);
  }

  /**
   * Create a new business unit
   */
  createBusinessUnit(unit: Omit<BusinessUnit, 'id' | 'createdAt' | 'updatedAt'>): Observable<BusinessUnit> {
    this._isLoading.set(true);
    this._error.set(null);

    const newUnit: BusinessUnit = {
      ...unit,
      id: `bu_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Simulate API call
    return of(newUnit).pipe(
      delay(300),
      map(createdUnit => {
        this._businessUnits.update(units => [...units, createdUnit]);
        this._isLoading.set(false);
        return createdUnit;
      })
    );

    // Real API call:
    // return this.http.post<BusinessUnit>(this.API_URL, unit).pipe(
    //   map(newUnit => {
    //     this._businessUnits.update(units => [...units, newUnit]);
    //     this._isLoading.set(false);
    //     return newUnit;
    //   }),
    //   catchError(error => {
    //     this._error.set('Failed to create business unit');
    //     this._isLoading.set(false);
    //     return throwError(() => error);
    //   })
    // );
  }

  /**
   * Update an existing business unit
   */
  updateBusinessUnit(id: string, updates: Partial<BusinessUnit>): Observable<BusinessUnit> {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulate API call
    return of(this._businessUnits().find(u => u.id === id)).pipe(
      delay(300),
      map(existingUnit => {
        if (!existingUnit) {
          throw new Error('Business unit not found');
        }

        const updatedUnit: BusinessUnit = {
          ...existingUnit,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        this._businessUnits.update(units => 
          units.map(u => u.id === id ? updatedUnit : u)
        );
        this._isLoading.set(false);
        return updatedUnit;
      }),
      // Error handling would go here in real implementation
      map(unit => unit as BusinessUnit)
    );
  }

  /**
   * Archive (soft delete) a business unit
   */
  archiveBusinessUnit(id: string): Observable<BusinessUnit> {
    return this.updateBusinessUnit(id, { status: 'archived' });
  }

  /**
   * Delete a business unit (hard delete)
   */
  deleteBusinessUnit(id: string): Observable<void> {
    this._isLoading.set(true);
    this._error.set(null);

    // Simulate API call
    return of(undefined).pipe(
      delay(300),
      map(() => {
        this._businessUnits.update(units => units.filter(u => u.id !== id));
        this._isLoading.set(false);
      })
    );

    // Real API call:
    // return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
    //   map(() => {
    //     this._businessUnits.update(units => units.filter(u => u.id !== id));
    //     this._isLoading.set(false);
    //   }),
    //   catchError(error => {
    //     this._error.set('Failed to delete business unit');
    //     this._isLoading.set(false);
    //     return throwError(() => error);
    //   })
    // );
  }

  /**
   * Get business units statistics
   */
  getBusinessStats(): Observable<{
    totalUnits: number;
    activeUnits: number;
    totalProcesses: number;
    totalSavings: number;
  }> {
    const units = this._businessUnits();
    const stats = {
      totalUnits: units.length,
      activeUnits: units.filter(u => u.status === 'active').length,
      totalProcesses: units.reduce((sum, u) => sum + u.metrics.totalProcesses, 0),
      totalSavings: units.reduce((sum, u) => sum + u.metrics.monthlySavings, 0)
    };

    return of(stats).pipe(delay(200));
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Refresh data from server
   */
  refresh(): void {
    this.getBusinessUnits().subscribe();
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    const mockData: BusinessUnit[] = [
      {
        id: 'bu_001',
        name: 'Finance Department',
        code: 'FIN',
        description: 'Handles all financial operations, accounting, and budgeting',
        status: 'active',
        managerId: 'user_001',
        manager: {
          id: 'user_001',
          fullName: 'John Smith',
          email: 'john.smith@company.com'
        },
        processIds: ['proc_001', 'proc_002', 'proc_003'],
        metrics: {
          totalProcesses: 12,
          activeAutomations: 8,
          monthlySavings: 15420,
          efficiency: 87
        },
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T00:00:00Z'
      },
      {
        id: 'bu_002',
        name: 'Human Resources',
        code: 'HR',
        description: 'Employee management, recruitment, and HR operations',
        status: 'active',
        managerId: 'user_002',
        manager: {
          id: 'user_002',
          fullName: 'Sarah Johnson',
          email: 'sarah.j@company.com'
        },
        processIds: ['proc_004', 'proc_005'],
        metrics: {
          totalProcesses: 8,
          activeAutomations: 5,
          monthlySavings: 8750,
          efficiency: 92
        },
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-18T00:00:00Z'
      },
      {
        id: 'bu_003',
        name: 'Customer Service',
        code: 'CS',
        description: 'Customer support, ticket management, and service operations',
        status: 'active',
        managerId: 'user_003',
        manager: {
          id: 'user_003',
          fullName: 'Mike Chen',
          email: 'mike.chen@company.com'
        },
        processIds: ['proc_006', 'proc_007', 'proc_008'],
        metrics: {
          totalProcesses: 15,
          activeAutomations: 10,
          monthlySavings: 12300,
          efficiency: 78
        },
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-22T00:00:00Z'
      },
      {
        id: 'bu_004',
        name: 'Operations',
        code: 'OPS',
        description: 'Supply chain, logistics, and operational processes',
        status: 'inactive',
        managerId: 'user_004',
        manager: {
          id: 'user_004',
          fullName: 'Lisa Wong',
          email: 'lisa.wong@company.com'
        },
        processIds: ['proc_009'],
        metrics: {
          totalProcesses: 6,
          activeAutomations: 2,
          monthlySavings: 3200,
          efficiency: 45
        },
        createdAt: '2023-12-20T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      }
    ];

    this._businessUnits.set(mockData);
  }
}